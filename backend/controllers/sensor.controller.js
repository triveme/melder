require("dotenv").config();
const { ensurePermission } = require("../utils/ensure-permission");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const axios = require("axios");

const sensorUrls = process.env.SENSOR_GLASS_CONTAINERS.split(",");

let mailTransporter = null;

cron.schedule(process.env.SENSOR_CRON, function () {
  sensorUrls.forEach((url) => {
    withOneRetry(() =>
      sensorClient
        .get(url, {
          params: {
            keys: "data",
            startTs: new Date().getTime() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
            endTs: new Date().getTime(),
            interval: 1000 * 60 * 60 * 24, // 1 day
            agg: "NONE", // TODO: Replace with "MAX" once sensor values are usable
            limit: 200,
          },
          headers: {
            "X-Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // Currently, the response is just one json object with mutliple data points from the same sensor.
          // Hopefully, this will change in the future
          const sensors = processSensorResponse([response]);
          sensors.forEach((sensor) => {
            if (sensor.level >= process.env.SENSOR_GLASS_CONTAINER_TRIGGER) {
              sendMailForSensor(sensor);
            }
          });
        }),
    );
  });
});

const sensorClient = axios.create({
  baseURL: process.env.SENSOR_SOURCE,
});

let token = null;

function formattedAxiosError(error) {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.cause) {
    return error.cause;
  } else if (error.request) {
    return error.request;
  } else {
    return error?.message;
  }
}

function getToken(onSuccessCallback) {
  sensorClient
    .post(
      "/auth/login",
      {
        username: process.env.SENSOR_USER,
        password: process.env.SENSOR_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )
    .then((response) => {
      token = response.data.token;
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    })
    .catch((e) => {
      console.error("Authentication request failed:", formattedAxiosError(e));
      token = null;
    });
}

getToken();

function withOneRetry(func, res = undefined) {
  func().catch(() => {
    console.log("Could not get sensor data. Authenticating and retrying one more time...");
    getToken(() =>
      func().catch((e) => {
        console.error("Could not get sensor data. Giving up due to error:", formattedAxiosError(e));
        if (res !== undefined) {
          res.status(500).send({
            message: "Sensordaten können momentan nicht abgerufen werden. Bitte versuchen Sie es später erneut.",
          });
        }
      }),
    );
  });
}

exports.getLevelsOfGlassContainers = async (req, res) => {
  if (!ensurePermission(req, res, "sensor_perm")) {
    return; // Return early if permissions are not sufficient
  }

  const aggregatedResponse = [];

  sensorUrls.forEach((url) => {
    withOneRetry(
      () =>
        sensorClient
          .get(url, {
            params: {
              keys: "data",
              startTs: new Date().getTime() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
              endTs: new Date().getTime(),
              interval: 1000 * 60 * 60 * 24, // 1 day
              agg: "NONE", // TODO: Replace with "MAX" once sensor values are usable
              limit: 200,
            },
            headers: {
              "X-Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            aggregatedResponse.push(response);
            if (aggregatedResponse.length === sensorUrls.length) {
              res.status(200).send(processSensorResponse(aggregatedResponse));
            }
          }),
      res,
    );
  });
};

function processSensorResponse(sensorResponse) {
  const dataByAddress = {};

  sensorResponse.forEach((response) => {
    const filteredData = response.data.data.filter((d) => {
      const data = JSON.parse(d.value);
      return data.payload && data.payload.fillinglvl !== undefined;
    });

    filteredData.forEach((d) => {
      const timestamp = new Date(d.ts);
      const data = JSON.parse(d.value);
      const { payload } = data;
      const { fillinglvl } = payload;
      const address = "TODO: Replace with address when it's available";

      if (!dataByAddress[address] || timestamp > dataByAddress[address].timestamp) {
        dataByAddress[address] = {
          level: fillinglvl,
          timestamp: timestamp.toLocaleString(),
        };
      }
    });
  });

  return Object.entries(dataByAddress).map(([address, data]) => ({
    address,
    level: data.level,
    timestamp: data.timestamp,
  }));
}

function sendMailForSensor(sensorData) {
  if (
    process.env.MAIL_HOST &&
    process.env.MAIL_PORT &&
    process.env.MAIL_FROM &&
    process.env.MAIL_USER &&
    process.env.MAIL_PASSWORD &&
    process.env.SENSOR_GLASS_CONTAINER_RECIPIENTS
  ) {
    if (!mailTransporter) {
      buildTransporter();
    }
    const mailObject = buildMailObject(sensorData);
    mailTransporter
      .sendMail(mailObject)
      .then((res) => {
        console.log("Sensor mail sent successfully:", res);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.error("Missing mail configuration environment variables");
    return new Error("Missing mail configuration environment variables");
  }
}

function buildTransporter() {
  const transporterConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_PORT == 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
  mailTransporter = nodemailer.createTransport(transporterConfig);
}

function buildMailObject(sensorData) {
  const html = `
                <h1>Glascontainer in ${sensorData.address} benötigt Leerung</h1>
                <p>
                  <strong>Adresse:</strong> ${sensorData.address}
                  <br />
                  <strong>Aktueller Füllstand:</strong> ${sensorData.level}
                  <br />
                  <br />
                  Danke!
                </p>
              `;
  return {
    from: `"Infopin Hünfeld" <${process.env.MAIL_FROM}>`,
    to: process.env.SENSOR_GLASS_CONTAINER_RECIPIENTS,
    subject: `Glascontainer in ${sensorData.address} ist voll`,
    html: html,
    text: html,
  };
}
