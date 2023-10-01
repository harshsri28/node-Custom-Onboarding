const { getCustomerData } = require("../../models/customerData");

module.exports = {
  authentication: async (req, res, next) => {
    const headerUserName = req.header("username");
    const headerPassword = req.header("password");

    const response = await getCustomerData({
      username: headerUserName,
      password: headerPassword,
    });

    if (response) {
      return next();
    }

    return res.status(401).json({ ok: false, error: "UnAuthorized User" });
  },
};
