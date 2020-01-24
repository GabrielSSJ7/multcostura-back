var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("debug", process.env.MONGO_DEBUG || false);
mongoose.set("useFindAndModify", false);
mongoose.set("runValidators", true);
mongoose.set("useCreateIndex", true);
mongoose.Promise = global.Promise;
const connection = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  promiseLibrary: global.Promise,
  useUnifiedTopology: true
});
connection
  .then(db => {
    return db;
  })
  .catch(err => {
    console.log("Error =>  ", err);
    if (err.message.code === "ETIMEDOUT") {
      mongoose.connect(dbURL, {
        useNewUrlParser: true,
        promiseLibrary: global.Promise
      });
    } else {
      console.log("Error while attempting to connect to database:", dbURL, {
        useNewUrlParser: true,
        promiseLibrary: global.Promise,
        useUnifiedTopology: true
      });
    }
  });

export default connection;
