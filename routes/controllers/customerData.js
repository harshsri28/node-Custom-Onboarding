const customerDataService = require("../services/customerData");

async function uploadCustomerData(req, res) {
  const {
    route: { path },
    body: { name, username, password, email, mobileNumber },
  } = req;

  try {
    if (!name) {
      return res.status(400).json({ ok: false, error: "Name is required" });
    }
    if (typeof name != "string") {
      return res
        .status(400)
        .json({ ok: false, error: "Name should be string" });
    }
    if (!mobileNumber) {
      return res
        .status(400)
        .json({ ok: false, error: "mobileNumber is required" });
    }
    if (!username) {
      return res.status(400).json({ ok: false, error: "username is required" });
    }
    if (!password) {
      return res.status(400).json({ ok: false, error: "password is required" });
    }
    if (!email) {
      return res.status(400).json({ ok: false, error: "Email is required" });
    }

    const response = await customerDataService.uploadCustomerData({
      email,
      password,
      mobileNumber,
      name,
      username,
    });

    if (response.ok) {
      return res.status(201).json({ ok: true, data: response.data });
    }
    return res.status(400).json({ ok: false, error: "Something went wrong" });
  } catch (error) {
    console.error("Error uploading customer data:", error);
    res.status(500).json({
      ok: false,
      error: "Error occur in Controller uploadCustomerData ",
    });
  }
}

async function getCustomerDetail(req, res) {
  const {
    route: { path },
    body: { username, password, email },
  } = req;

  try {
    if (!password) {
      return res.status(400).json({ ok: false, error: "password is required" });
    }
    if (!username && !email) {
      return res
        .status(400)
        .json({ ok: false, error: "Either email or username is required" });
    }

    const response = await customerDataService.getCustomerDetail({
      email,
      password,
      username,
    });
    if (response.ok) {
      return res.status(201).json({ ok: true, data: response.data });
    }
    return res.status(400).json({ ok: false, error: response.message });
  } catch (err) {
    console.error("Error uploading customer data:", err);
    res.status(500).json({
      ok: false,
      error: "Error occur in Controller getCustomerDetail ",
    });
  }
}

async function validateUser(req, res) {
  const {
    route: { path },
  } = req;
  try {
    const response = await customerDataService.validateUser({
      customerId: req.header("customerId"),
    });
    if (response.ok) {
      return res.status(200).json({ ok: true, data: response.data });
    }
    return res.status(400).json({ ok: false, error: response.message });
  } catch (err) {
    console.error("Error uploading customer data:", err);
    res
      .status(500)
      .json({ ok: false, error: "Error occur in Controller validateUser " });
  }
}

async function sendOtp(req, res) {
  const {
    body: { mobileNumber },
    route: { path },
  } = req;
  try {
    if (!mobileNumber) {
      return res.status(400).json({ error: "mobileNumber is required" });
    }
    const response = await customerDataService.sendOtp({
      mobileNumber,
      customerId: req.header("customerId"),
    });
    if (response.ok) {
      return res.status(200).json({ ok: true, data: response.data });
    }
    return res.status(400).json({ ok: false, error: response.message });
  } catch (err) {
    console.error("Error uploading customer data:", err);
    res.status(500).json({ error: "Error occur in Controller sendOtp " });
  }
}

async function verifyOtp(req, res) {
  const {
    route: { path },
    body: { otp },
  } = req;
  try {
    if (!otp) {
      return res.status(400).json({ error: "mobileNumber is required" });
    }
    const response = await customerDataService.verifyOtp({
      otp,
      customerId: req.header("customerId"),
    });
    if (response.ok) {
      return res.status(200).json({ ok: true, data: response.data });
    }
    return res.status(400).json({ ok: false, error: response.message });
  } catch (err) {
    console.error("Error uploading customer data:", err);
    res.status(500).json({ error: "Error occur in Controller verifyOtp " });
  }
}

module.exports = {
  uploadCustomerData,
  getCustomerDetail,
  validateUser,
  sendOtp,
  verifyOtp,
};
