const mongoose = require("mongoose");

const { Schema } = mongoose;

const customerJwt = mongoose.model(
  "customer_Jwt",
  new Schema({
    customerId: { type: String },
    token: { type: String },
  }),
  "customer_Jwt"
);

module.exports = {
  customerJwt,

  checkCustomerLoggedIn: async ({ customerId }) => {
    const pipeline = [
      {
        $match: {
          customerId,
        },
      },
      {
        $project: {
          token: 1,
        },
      },
    ];

    const result = await customerJwt.aggregate(pipeline);
    if (result.length) {
      return result[0]?.token;
    }

    return null;
  },

  validateUserCheck: async ({ customerId }) => {
    const deletedRecord = await customerJwt.findOneAndDelete({ customerId });
    if (deletedRecord) {
      return true;
    }
    return false;
  },
};
