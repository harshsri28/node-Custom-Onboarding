const mongoose = require("mongoose");

const { Schema } = mongoose;

const vehicleDataModel = mongoose.model(
  "vehicle_Data",
  new Schema({
    customerId: { type: String },
    task: { type: String },
    timeStamp: { type: Date, default: Date.now },
  }),
  "vehicle_Data"
);

module.exports = {
  vehicleDataModel,
};
