import fs from "fs";
import path from "path";

module.exports = {
  async store(req, res) {
    const { id, type, model } = req.headers;

    const { originalname, buffer } = req.file;

    const Model = require(`../database/mongo/models/${model}`);
    const modelDb = await Model.findById(id);

    if (!id || !type || !model)
      return res
        .status(400)
        .send("ID e o tipo do arquivo não específicado, contate o suporte");
    if (!modelDb) return res.status(400).send("Notícia não encontrada");
    const folderPath = path.join(
      __dirname,
      "../../dist/" + model + "/" + id + "/gallery/" + type + "/"
    );
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });

    const newName =
      originalname.split(".")[0] +
      Date.now() +
      "." +
      originalname.split(".")[1];
    fs.writeFileSync(folderPath + newName, buffer);
    modelDb.gallery[type].push(newName);
    await modelDb.save();
    return res.json(model);
  },
  async index(req, res) {
    const { model } = req.headers;
    const Model = require(`../database/mongo/models/${model}`);
    const result = await Model.find();
    return res.json(result);
  },
  async show(req, res) {
    const { id } = req.params;
    const { model } = req.headers;
    if (!id)
      return res
        .status(400)
        .send("Id da notícia não enviado, contato o suporte");
    const Model = require(`../database/mongo/models/${model}`);
    const result = await Model.findById(id);

    if (!result) return res.status(400).send("Nenhuma notícia encontrada");

    return res.json(result);
  },

  async delete(req, res) {
    const { id } = req.params;
    const { index, model, type } = req.headers;

    if (!id)
      return res
        .status(400)
        .send("ID da notícia não enviado, contate o suporte");
    const Model = await require(`../database/mongo/models/${model}`);
    const result = await Model.findById(id);

    const folderPath = path.join(
      __dirname,
      "../../dist/" + model + "/" + id + "/gallery/" + type + "/"
    );
    console.log(folderPath + result.gallery[type][index]);

    if (fs.existsSync(folderPath + result.gallery[type][index]))
      fs.unlinkSync(folderPath + result.gallery[type][index]);

    result.gallery[type].splice(index, 1);
    await result.save();

    return res.json(result.gallery[type]);
  }
};
