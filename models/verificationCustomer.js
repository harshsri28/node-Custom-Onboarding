const mongoose = require("mongoose");

const { Schema } = mongoose;

const verificationCustomerModel = mongoose.model(
  "verification_Customer",
  new Schema({
    customerId: { type: String },
    OTP: { type: Number },
    timeStamp: { type: Date, default: Date.now },
    retryCount: { type: Number, default: 0 },
  }).index({ timeStamp: 1 }, { expireAfterSeconds: 600 }),
  "verification_Customer"
);

module.exports = {
  verificationCustomerModel,

  getOtp: async ({ customerId }) => {
    const pipeline = [
      { $match: { customerId } },
      { $sort: { timeStamp: -1 } },
      { $limit: 1 },
      { $project: { OTP: 1, _id: 0 } },
    ];
    const latestOtpDocument = await verificationCustomerModel.aggregate(
      pipeline
    );
    if (latestOtpDocument.length > 0) {
      return latestOtpDocument[0].OTP;
    } else {
      return null;
    }
  },
};
