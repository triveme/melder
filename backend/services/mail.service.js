require("dotenv/config");
const nodemailer = require("nodemailer");

const RECIPIENTS = {
  road_sign: process.env.ROAD_SIGN,
  parking_spaces: process.env.PARKING_SPACES,
  streets: process.env.STREETS,
  waters: process.env.WATERS,
  community_centre: process.env.COMMUNITY_CENTRE,
  wild_garbage_dumping: process.env.WILD_GARBAGE_DUMPING,
  trash_cans: process.env.TRASH_CANS,
  public_toilets: process.env.PUBLIC_TOILETS,
  parks: process.env.PARKS,
  leisure_facilities: process.env.LEISURE_FACILITIES,
  lamps: process.env.LAMPS,
  other: process.env.OTHER,
};

exports.sendMail = async (data, files) => {
  if (
    process.env.MAIL_HOST &&
    process.env.MAIL_PORT &&
    process.env.MAIL_FROM &&
    process.env.MAIL_HOST != "" &&
    process.env.MAIL_PORT != "" &&
    process.env.MAIL_FROM != ""
  ) {
    if (data != undefined || data != null) {
      const transporter = buildTransporter();
      const mailObject = buildMailObject(data, files);
      const response = transporter
        .sendMail(mailObject)
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

      return response;
    }
    console.error("No data provided");
    return new Error("No data provided");
  } else {
    console.log("data");
    console.log(data);
    console.log("files");
    console.log(files);
    console.log(buildMailObject(data, files));
    console.error("No mail configuration provided");
    return new Error("No mail configuration provided");
  }
};

function buildMailObject(data, files) {
  const html = buildHtmlBody(data);
  let mailObject = {
    from: '"Mängelmelder Hünfeld" <' + process.env.MAIL_FROM + ">",
    to: getRecipient(data.recipient),
    subject: "Neue Mängel-Meldung",
    html: html,
    text: html,
  };

  if (files && files.length > 0) {
    mailObject["attachments"] = [];
    files.map((file) => {
      mailObject["attachments"].push({
        filename: file.originalname,
        path: file.path,
        contentType: file.mimetype,
      });
    });
  }
  return mailObject;
}

function buildHtmlBody(data) {
  let htmlBody = `
        <h1>Neue Mängel-Meldung</h1>
        <p>
        <strong>Email:</strong> ${data.email}<br>
        <strong>Kategorie:</strong> ${data.category}<br>
        `;
  if (data.phone_no) {
    htmlBody += `
        <strong>Telefonnummer:</strong> ${data.phone_no}<br>`;
  }
  if (data.location) {
    const locationObject = JSON.parse(data.location);
    if (locationObject.lat && locationObject.lng) {
      htmlBody += `
          <br><strong>Latitude:</strong> ${locationObject.lat}<br>
          <strong>Longitude:</strong> ${locationObject.lng}<br>
          <a href="https://google.com/maps/?q=${locationObject.lat},${locationObject.lng}">Position auf Google Maps anzeigen</a><br>`;
    } else if (locationObject.city && locationObject.zip && locationObject.street && locationObject.house_no) {
      htmlBody += `
          <br><strong>Ort:</strong> ${locationObject.city}<br>
          <strong>Postleitzahl:</strong> ${locationObject.zip}<br>
          <strong>Adresse:</strong> ${locationObject.street + " " + locationObject.house_no}<br>
          <a href="https://google.com/maps/?q=${locationObject.city} ${locationObject.zip} ${locationObject.street} ${
            locationObject.house_no
          }">Position auf Google Maps anzeigen</a><br>`;
    }
  }
  htmlBody += `
  <br><strong>Beschreibung:</strong> ${data.description}<br>
  </p>`;

  return htmlBody;
}

function getRecipient(category) {
  if (process.env.STAGE != "dev") {
    if (category != undefined && category != null && category != "") {
      if (RECIPIENTS[category] != undefined && RECIPIENTS[category] != null) {
        return RECIPIENTS[category];
      }
    }
    return RECIPIENTS.other;
  }
  return process.env.MAIL_DEBUG_RECIPIENT;
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
  return nodemailer.createTransport(transporterConfig);
}
