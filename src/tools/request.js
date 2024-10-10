const request = require("request");
const { baseURL, token } = require("../../config");
const get = function (url) {
  return new Promise((res, rej) => {
    var u = baseURL + url;
    request(
      {
        url: u,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `token ${token}`,
        },
      },
      (err, response, body) => {
        if (err) {
          rej(err);
        } else {
          res(body);
        }
      }
    );
  });
};
const Request = function (url) {
  var u = baseURL + url;
  return request(u, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `token ${token.split(" ").reverse().join("")}`,
    },
  });
};
module.exports = { get, Request };
