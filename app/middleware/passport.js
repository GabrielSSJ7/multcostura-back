require("dotenv").config();
const passport = require("passport");
const passportJwt = require("passport-jwt");
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {
  const params = {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };

  const strategy = new Strategy(params, (payload, done) => {
    ModelUser.findById(payload.id, function(err, doc) {
      if (err) return done(err, false);
      return done(null, user ? { ...payload } : false);
    });
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate("jwt", { session: false })
  };
};
