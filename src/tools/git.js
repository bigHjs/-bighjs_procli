const request = require("./request");
const Request = require("request");
const { users } = require("../../config");

const Git = function () {
  return {
    users,
    Request,
    getProjectList() {
      return request.get(`/users/${this.users}/repos`);
    },
    getProjectVersions(repo) {
      return request.get(`/repos/${this.users}/${repo}/tags`);
    },
    downloadProject(url) {
      return request.Request(url);
    },
  };
};

module.exports = Git();
