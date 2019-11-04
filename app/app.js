import "dotenv/config";
import express from "express";
import consign from "consign";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
require("./database/mongo");
const port = process.env.PORT || 4000;

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
  }

  init() {
    this.configs();
    this.app.listen(this.port, () => {
      console.log("Serving on ", port);
    });
  }

  configs() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use("/dist", express.static(path.join(__dirname, "../dist")));
    consign({ verbose: false })
      .then("./app/controller/categories.js")
      .then("./app/controller/manufacturer.js")
      .then("./app/controller/reseller.js")
      .then("./app/controller/machine.js")
      .then("./app/routes/private.js")
      .then("./app/routes/public.js")
      .into(this.app);

    return this;
  }
}

export default App;
