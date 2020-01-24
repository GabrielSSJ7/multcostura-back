module.exports = gl => {
  const { user } = gl.app.controller;

  gl.route("/user").post(user.store);
  gl.route("/user/auth").post(user.show);
};
