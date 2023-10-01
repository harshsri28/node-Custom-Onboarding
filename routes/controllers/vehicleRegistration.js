const vechicleService = require("../services/vehicleRegistration");

async function uploadVehicleDetails(req, res) {
  const {
    route: { path },
    body: { vehicleNumber },
  } = req;
  try {
    if (!vehicleNumber) {
      return res
        .status(400)
        .json({ ok: false, error: "VehicleNumber is required" });
    }
    const response = await vechicleService.uploadVehicleDetails({
      vehicleNumber,
      customerId: req.header("customerId"),
    });
    if (response.ok) {
      return res.status(201).json({ ok: true, data: response.data });
    }
    return res.status(400).json({ ok: false, error: response.message });
  } catch (err) {
    console.error("Error uploading customer data:", err);
    res.status(500).json({
      ok: false,
      error: "Error occur in Controller uploadCustomgetVehicleDetailserData ",
    });
  }
}

async function fetchDetails(req,res){
  
}

module.exports = {
  uploadVehicleDetails,
};
