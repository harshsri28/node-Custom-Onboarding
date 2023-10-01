require("dotenv").config();
const jwt = require("jsonwebtoken");
var axios = require("axios").default;

const signzyAuth = require("../middlewares/signzyAuth");
const {
  customersDataModel,
  getCustomerData,
} = require("../../models/customerData");
const {
  customerJwt,
  checkCustomerLoggedIn,
  validateUserCheck,
} = require("../../models/customerJwt");
const {
  verificationCustomerModel,
  getOtp,
} = require("../../models/verificationCustomer");
const { createOtpOptions } = require("../../utils/otpConfig");

module.exports = {
  uploadCustomerData: async ({
    mobileNumber,
    name,
    username,
    password,
    email,
  }) => {
    try {
      const newCustomer = {
        mobileNumber,
        name,
        username,
        password,
        email,
      };
      const response = await customersDataModel.create(newCustomer);
      return { ok: true, data: "Data Created Successfully" };
    } catch (err) {
      console.error("Error uploading customer data:", err);
      return { ok: false, error: err.message };
    }
  },

  getCustomerDetail: async ({ email = "", password = "", username = "" }) => {
    try {
      const response = await getCustomerData({
        email,
        password,
        username,
      });

      if (!response) {
        return {
          ok: false,
          message: "Enter valid credentials",
        };
      }

      const checkCustomerLoginStatus = await checkCustomerLoggedIn({
        customerId: response.toString(),
      });

      if (checkCustomerLoginStatus) {
        return {
          ok: true,
          data: {
            customerId: response.toString(),
            token: checkCustomerLoginStatus,
            TTL: "16678787866",
          },
        };
      }

      const payload = {
        customerId: response.toString(),
      };

      const secretKey = process.env.SECRET_KEY_JWT;
      const expiresIn = 3600;
      const token = jwt.sign(payload, secretKey, { expiresIn });

      const customerJwtObject = {
        customerId: response.toString(),
        token,
      };

      await customerJwt.create(customerJwtObject);
      return {
        ok: true,
        data: {
          customerId: response.toString(),
          token: token,
          TTL: "1667888488",
        },
      };
    } catch (err) {
      console.error("Error getting customer data from service:", err);
      return { ok: false, error: err.message };
    }
  },

  validateUser: async ({ customerId }) => {
    try {
      const checkCustomerExist = await validateUserCheck({
        customerId,
      });
      if (checkCustomerExist) {
        return {
          ok: true,
          data: "User Successfully Validated",
        };
      }
      return {
        ok: false,
        message: "User doesn't Validated",
      };
    } catch (err) {
      console.error("Error getting validate User from service:", err);
      return { ok: false, error: err.message };
    }
  },

  sendOtp: async ({ mobileNumber, customerId }) => {
    try {
      const authData = await signzyAuth();
      const options = createOtpOptions(authData, mobileNumber);

      const response = await axios(options);
      if (response.status === 200) {
        const currentTime = new Date().toISOString();

        const newData = {
          customerId: customerId,
          OTP: 12345,
          timeStamp: currentTime,
        };
        const response = await verificationCustomerModel.create(newData);
        return { ok: true, data: "OTP sent Successfully" };
      }
      return { ok: false, message: "OTP doesn't send" };
    } catch (err) {
      console.error("Error occur otp service:", err);
      return { ok: false, message: err.message };
    }
  },

  verifyOtp: async ({ otp, customerId }) => {
    try {
      const response = await getOtp({ customerId: customerId });
      const customer = await verificationCustomerModel.findOne({
        customerId: customerId,
      });
      if (customer && customer.retryCount >= 2) {
        return { ok: false, message: "Retry limit exceeded" };
      }
      if (response && response === otp && customer) {
        customer.retryCount = 0;
        await customer.save();
        return { ok: true, data: "OTP verified Successfully" };
      } else {
        if (customer) {
          customer.retryCount += 1;
          await customer.save();
        }
        return { ok: false, message: "Wrong otp" };
      }
    } catch (err) {
      console.error("Error occur verifyOtp Service:", err);
      return { ok: false, message: err.message };
    }
  },
};
