require("dotenv").config();
var axios = require("axios").default;

const { createVehicleOptions } = require("../../utils/vehicleConfig");
const { vehicleDataModel } = require("../../models/vehicleData");
const signzyAuth = require("../middlewares/signzyAuth");
console.log("hdkkjskfjdjf", signzyAuth);
const signzyUrl = process.env.SIGNZY_URL;

module.exports = {
  uploadVehicleDetails: async ({ vehicleNumber, customerId }) => {
    try {
      const authData = await signzyAuth();

      const options = createVehicleOptions(authData, vehicleNumber);

      const response = await axios(options);
      if (response?.status) {
        const currentTime = new Date().toISOString();
        const newData = {
          customerId: customerId,
          task: "Vehicle Search",
          time: currentTime,
        };
        const response = await vehicleDataModel.create(newData);
        return { ok: true, data: "Vehicle Search Successfully done" };
      }
      return { ok: false, message: "Invalid Credentials" };
    } catch (err) {
      console.error("error occur during Service uploadVehicleDetails:", err);
      return { ok: false, error: err.message };
    }
  },
};
