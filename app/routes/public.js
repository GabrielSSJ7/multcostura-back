module.exports = app => {
  app.route("/public").get((r, res) => {
    return res.send("publioc");
  });
};
