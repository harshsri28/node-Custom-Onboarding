require("dotenv").config();
const axios = require("axios").default;

function authenticate() {
  const options = {
    method: "POST",
    url: process.env.SIGNZY_LOGIN_URL,
    headers: { "Accept-Language": "en-US,en;q=0.8", Accept: "*/*" },
    data: {
      username: process.env.AUTH_LOGIN,
      password: process.env.AUTH_PASSWORD,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
}

module.exports = authenticate;
