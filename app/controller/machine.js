import ModelMachine from "../database/mongo/models/machine";
import path from "path";
import fs from "fs";
import { fieldValidation } from "../utils/validations";

module.exports = app => ({
  async store(req, res) {
    const files = req.files;
    const {
      name,
      manufacturer,
      description,
      video,
      category,
      mainFeatures,
      specifications
    } = req.body;
    const fail = fieldValidation({
      name,
      manufacturer,
      description,
      category,
      mainFeatures
    });
    if (!fail.return)
      return res.status(400).send(`${fail.message} ${fail.field}`);
    const machine = new ModelMachine();
    machine.name = name;
    machine.manufacturer = manufacturer;
    machine.description = description;
    machine.video = video ? JSON.parse(video) : null;
    machine.category = category;
    machine.mainFeatures = mainFeatures;
    machine.specifications = specifications ? JSON.parse(specifications) : null;
    let machineCreated = await machine.save();
    if (req.files.length > 0) {
      const images = files.map((file, i) => {
        const mimeType = file.mimetype.split("/");
        const filePath = path.join(__dirname, "../../dist/machines/images/");
        if (!fs.existsSync(filePath + machineCreated._id + "/"))
          fs.mkdirSync(filePath + machineCreated._id + "/", {
            recursive: true
          });
        fs.writeFileSync(
          `${filePath}${machineCreated._id}/${i}.${mimeType[1]}`,
          file.buffer
        );
        return `/${machineCreated._id}/${i}.${mimeType[1]}`;
      });
      machineCreated.images = images;
      machineCreated = await machineCreated.save();
    }
    return res.json(machineCreated);
  },
  async index(req, res) {
    const { manufacturer, category } = req.query;
    let filter = {};
    if (manufacturer) filter = { manufacturer };
    if (category) filter = { ...filter, category };
    const machines = await ModelMachine.find(filter);
    if (machines.length > 0) {
      const responseMachines = machines.map(machine => {
        return {
          _id: machine.id,
          name: machine.name,
          description: machine.description,
          mainFeatures: machine.mainFeatures,
          specifications: machine.specifications,
          video: machine.video,
          images: machine.images.map(
            img => `${process.env.STATIC_FILES_URL}machines/images${img}`
          )
        };
      });
      return res.json(responseMachines);
    } else {
      return res.status(400).send("Nenhuma máquina encontrada ");
    }
  },
  async show(req, res) {
    const { id } = req.params;
    const machine = await ModelMachine.findById(id);
    if (machine) {
      return res.json(machine);
    } else {
      return res.status(400).send("Máquina não encontrada");
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const {
      video,
      name,
      manufacturer,
      category,
      description,
      mainFeatures,
      specifications
    } = req.body;
    const files = req.files;

    if (!id) return res.status(400).send("ID não informado");
    const machine = await ModelMachine.findById(id);
    if (machine) {
      let fail = fieldValidation({
        name,
        manufacturer,
        category,
        description,
        mainFeatures
      });
      if (!fail.return)
        return res.status(400).send(`${fail.message} ${fail.field}`);
      machine.video = video;
      machine.name = name;
      machine.manufacturer = manufacturer;
      machine.category = category;
      machine.description = description;
      machine.mainFeatures = mainFeatures;
      machine.specifications = specifications;
      let images = [];
      const filePath = path.join(__dirname, "../../dist/machines/images/");
      if (files.length > 0) {
        let imagesFail = false;

        fs.readdirSync(`${filePath}${id}`).forEach(img => {
          files.forEach(file => {
            const originalname = file.originalname;
            const _originalname = file.originalname.split(".");
            const fileFolderName = img.split(".");
            if (fileFolderName[0] == _originalname[0]) {
              fs.unlinkSync(`${filePath}${id}/${img}`);
              fs.writeFileSync(`${filePath}${id}/${originalname}`, file.buffer);
            } else {
              fs.writeFileSync(`${filePath}${id}/${originalname}`, file.buffer);
            }
          });
        });
        images = fs.readdirSync(`${filePath}${id}`);
        images = images.map(img => `/${id}/${img}`);

        if (imagesFail)
          return res.status(400).send("Nome da imagem é inválido");
      }

      machine.images = images;
      const machineReturn = await machine.save();
      return res.json(machineReturn);
    } else {
      return res.status(400).send("Máquina não encontrada");
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID não informado");
    const machine = await ModelMachine.findById(id);
    if (machine) {
      machine.images.forEach(img => {
        const filePath = path.join(__dirname, "../../dist/machines/images");
        if (fs.existsSync(filePath + img)) {
          fs.unlinkSync(filePath + img);
        }
      });
      ModelMachine.deleteOne({ _id: id }, function(err) {
        if (err) return res.status(500).send(err);
        return res.sendStatus(200);
      });
    }
  }
});
