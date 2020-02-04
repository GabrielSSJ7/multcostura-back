import institutional from "../controller/institutional";

module.exports = gl => {
  const { user, banner } = gl.app.controller;

  gl.route("/user").post(user.store);
  gl.route("/user/auth").post(user.show);
  gl.route("/banner/:id").get(banner.index);
  gl.route("/institutional/:type").get(institutional.index);
};
