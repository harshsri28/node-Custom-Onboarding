const mongoose = require("mongoose");

const { Schema } = mongoose;

const customersDataModel = mongoose.model(
  "customer_data",
  new Schema({
    name: { type: String },
    mobileNumber: { type: Number },
    email: { type: String },
    password: { type: String },
    username: { type: String },
  }),
  "customer_data"
);

module.exports = {
  customersDataModel,

  getCustomerData: async ({ username, password, email }) => {
    const pipeline = [
      {
        $match: {
          $or: [{ email: email }, { username: username }],
        },
      },
      {
        $match: {
          password: password,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ];

    const result = await customersDataModel.aggregate(pipeline);
    if (result.length) {
      return result[0]?._id;
    }
    return null;
  },
};
