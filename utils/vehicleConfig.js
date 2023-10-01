require("dotenv").config();
const axios = require("axios");

function createVehicleOptions(authData, vehicleNumber) {
  return {
    method: "POST",
    url: `${process.env.SIGNZY_URL}/${authData.userId}/vehicleregistrations`,
    headers: {
      Authorization: authData.id,
      "Content-type": "application/json",
    },
    data: {
      task: "detailedSearch",
      essentials: { vehicleNumber: vehicleNumber },
    },
  };
}

module.exports = { createVehicleOptions };
