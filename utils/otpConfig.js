require("dotenv").config();
const axios = require("axios");

function createOtpOptions(authData, mobileNumber) {
  return {
    method: "POST",
    url: process.env.SIGNZY_OTP_URL,
    headers: {
      Authorization: authData.id,
      "Content-type": "application/json",
    },
    data: {
      to: [mobileNumber],
      message:
        "One time password (OTP) for verification is 12345. Do not share this message with anyone.\n-Signzy",
      templateId: process.env.OTP_TEMPLATE_ID,
    },
  };
}

module.exports = { createOtpOptions };
