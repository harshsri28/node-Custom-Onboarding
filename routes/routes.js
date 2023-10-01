const router = require("express").Router();

const customerDataController = require("./controllers/customerData");
const vehicleRegistrationController = require("./controllers/vehicleRegistration");
const { authentication } = require("./middlewares/auth");

router.get("/api/ping", authentication, (req, res) => {
  const uptime = process.uptime();
  const currentTime = new Date();
  res.json({
    ok: true,
    status: "Pong",
    uptime: uptime,
    currentTime: currentTime,
  });
});

router.post(
  "/api/customers",
  authentication,
  customerDataController.uploadCustomerData
);
router.post(
  "/api/customers/login",
  authentication,
  customerDataController.getCustomerDetail
);

router.get(
  "/api/customers/logout",
  authentication,
  customerDataController.validateUser
);

router.post(
  "/api/vehicle",
  authentication,
  vehicleRegistrationController.uploadVehicleDetails
);

router.post(
  "/api/otp-generate",
  authentication,
  customerDataController.sendOtp
);
router.post(
  "/api/otp-verify",
  authentication,
  customerDataController.verifyOtp
);

module.exports = router;
