import "dotenv/config";
import express from "express";
import consign from "consign";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
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

  initDist() {
    const pathDist = path.join(__dirname, "../dist/");
    // Creating dist folder
    fs.mkdirSync(pathDist, { recursive: true });
    // Creating machines folder
    fs.mkdirSync(pathDist + "machines/images/", { recursive: true });
    // Creating icons folders
    fs.mkdirSync(pathDist + "icons/categories/", { recursive: true });
    fs.mkdirSync(pathDist + "icons/manufacturer/", { recursive: true });
    //Creating logos manufacturer folder
    fs.mkdirSync(pathDist + "logos/manufacturer/", { recursive: true });
  }

  configs() {
    this.initDist();
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
