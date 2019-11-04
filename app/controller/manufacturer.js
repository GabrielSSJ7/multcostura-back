import ModelManufacturer from "../database/mongo/models/manufacturer";
import path from "path";
import fs from "fs";

module.exports = app => ({
  async store(req, res) {
    const { name, description } = req.query;
    const files = req.files;

    const manufacturer = new ModelManufacturer();
    manufacturer.name = name;
    manufacturer.description = description;
    console.log("FILES => ", files);
    if (files.logo) manufacturer.logo = files.logo[0].filename;
    if (files.icon) manufacturer.appIcon = files.icon[0].filename;

    const manufacturerReturn = await manufacturer.save();
    return res.status(201).json(manufacturerReturn);
  },
  async index(req, res) {
    const manufacturer = await ModelManufacturer.find();
    const resManufacturer = manufacturer.map(man => {
      return {
        id: man._id,
        name: man.name,
        description: man.description,
        created_at: man.created_at,
        appIcon: man.appIcon
          ? `${process.env.STATIC_FILES_URL}icons/manufacturer/${man.appIcon}`
          : null,
        logo: man.logo
          ? `${process.env.STATIC_FILES_URL}logos/manufacturer/${man.logo}`
          : null
      };
    });
    return res.json(resManufacturer);
  },
  async show(req, res) {
    const { id } = req.params;
    const manufacturer = await ModelManufacturer.findById(id);
    if (manufacturer) {
      return res.json({
        name: manufacturer.name,
        description: manufacturer.description,
        appIcon: manufacturer.appIcon ? manufacturer.appIcon : null,
        logo: manufacturer.logo ? manufacturer.logo : null,
        createdAt: manufacturer.createdAt
      });
    } else {
      return res.status(400).send(`ID ${id} não encontrado`);
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, description } = req.query;
    const files = req.files;
    const manufacturer = await ModelManufacturer.findById(id);
    if (manufacturer) {
      manufacturer.name = name;
      manufacturer.description = description;

      const fileIcon =
        path.join(__dirname, "../../dist") +
        "/icons/manufacturer/" +
        manufacturer.appIcon;

      if (fs.existsSync(fileIcon)) {
        if (files.icon) {
          fs.unlinkSync(fileIcon);
          manufacturer.appIcon = files.icon[0].filename;
        }
      } else {
        if (files.icon) manufacturer.appIcon = files.icon[0].filename;
      }

      const fileLogo =
        path.join(__dirname, "../../dist") +
        "/logos/manufacturer/" +
        manufacturer.logo;

      if (fs.existsSync(fileLogo)) {
        if (files.logo) {
          fs.unlinkSync(fileLogo);
          manufacturer.logo = manufacturer.logo = files.logo[0].filename;
        }
      } else {
        if (files.logo) manufacturer.logo = files.logo[0].filename;
      }
      // if (files.logo) manufacturer.logo = files.logo[0].filename;
      // if (files.icon) manufacturer.appIcon = files.icon[0].filename;
      const responseManufacturer = await manufacturer.save();
      return res.json(responseManufacturer);
    } else {
      return res.status(400).send(`ID ${id} não encontrado`);
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    const manufacturer = await ModelManufacturer.findById(id);
    const fileIcon =
      path.join(__dirname, "../../dist") +
      "/icons/manufacturer/" +
      manufacturer.appIcon;

    if (fs.existsSync(fileIcon)) {
      fs.unlinkSync(fileIcon);
    }

    const fileLogo =
      path.join(__dirname, "../../dist") +
      "/logos/manufacturer/" +
      manufacturer.logo;

    if (fs.existsSync(fileLogo)) {
      fs.unlinkSync(fileLogo);
    }
    ModelManufacturer.deleteOne({ _id: id }, function(err) {
      if (err) return res.status(500).send(err);
      return res.sendStatus(200);
    });
  }
});
