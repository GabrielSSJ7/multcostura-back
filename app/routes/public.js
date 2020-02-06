import institutional from "../controller/institutional";
import news from "../controller/news";
import gallery from "../controller/gallery";

module.exports = gl => {
  const { user, banner } = gl.app.controller;

  gl.route("/user").post(user.store);
  gl.route("/user/auth").post(user.show);
  gl.route("/banner/:id").get(banner.index);
  gl.route("/institutional/:type").get(institutional.index);
  gl.route("/news").get(news.index);
  gl.route("/news/:id").get(news.show);
  gl.route("/gallery/:id").get(gallery.show);
};
