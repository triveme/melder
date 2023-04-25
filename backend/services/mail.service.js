require("dotenv/config");
const nodemailer = require("nodemailer");

const RECIPIENTS = {
  road_sign:process.env.ROAD_SIGN,
  parking_spaces:process.env.PARKING_SPACES,
  streets:process.env.STREETS,
  waters:process.env.WATERS,
  community_centre:process.env.COMMUNITY_CENTRE,
  wild_garbage_dumping:process.env.WILD_GARBAGE_DUMPING,
  trash_cans:process.env.TRASH_CANS,
  public_toilets:process.env.PUBLIC_TOILETS,
  parks:process.env.PARKS,
  leisure_facilities:process.env.LEISURE_FACILITIES,
  other:process.env.OTHER,
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
      var response = "Test";
      var response = transporter
        .sendMail(mailObject)
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });

      return response;
    }
    console.log("No data provided");
    return new Error("No data provided");
  } else {
    console.log("No mail configuration provided");
    return new Error("No mail configuration provided");
  }
};

function buildMailObject(data, files) {
  const html = buildHtmlBody(data);
  var mailObject = {
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
  var htmlBody = `
        <h1>Neue Mängel-Meldung</h1>
        <p>
        <strong>Email:</strong> ${data.email}<br>
        <strong>Kategorie:</strong> ${data.category}<br>
        `;
  if (data.phone_no) {
    htmlBody += `
        <strong>Telefonnummer:</strong> ${data.phone_no}<br>`;
  }
  if (data.lat && data.lng) {
    htmlBody += `
        <br><strong>Latitude:</strong> ${data.lat}<br>
        <strong>Longitude:</strong> ${data.lng}<br>
        <a href="https://google.com/maps/?q=${data.lat},${data.lng}">Position auf Google Maps anzeigen</a><br>`;
  } else {
    htmlBody += `
        <br><strong>Ort:</strong> ${data.city}<br>
        <strong>Postzeitzahl:</strong> ${data.zip}<br>
        <strong>Adresse:</strong> ${data.street + " " + data.house_no}<br>
        <a href="https://google.com/maps/?q=${data.city} ${data.zip} ${
      data.street
    } ${data.house_no}">Position auf Google Maps anzeigen</a><br>`;
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
