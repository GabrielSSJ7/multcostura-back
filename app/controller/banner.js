import ModelCategoria from "../database/mongo/models/categories";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

module.exports = app => ({
  async store(req, res) {
    const { img, title, description, txtBtn, link, show, id } = req.body;
    const files = req.files;
    console.log(__dirname);

    try {
      const categoria = await ModelCategoria.findById(
        mongoose.Types.ObjectId(id)
      );
      if (!categoria) throw { status: 400, msg: "Categoria não encontrada" };

      if (files.length == 0)
        return res.status(400).send("Nenhuma imagem enviada");
      const bannerFolderPath = path.join(
        __dirname,
        "../../dist/banners/categories/" + id
      );
      if (!fs.existsSync(bannerFolderPath))
        fs.mkdirSync(bannerFolderPath, { recursive: true });

      const filesBannerFolder = fs.readFileSync(bannerFolderPath);

      console.log("==>",filesBannerFolder);
      

      await categoria.save();
      return res.status(200).json(categoria);
    } catch (e) {
      console.log(e);
      
      return res.status(e.status).send(e.msg);
    }
  },
  async update(req, res) {
    const { id } = req.body;
    try {
      const categoria = await ModelCategoria.findById(
        mongoose.Types.ObjectId(id)
      );
      if (!categoria) throw { status: 404, msg: "Categoria não encontrada" };
      categoria.banner.show = show;
      await categoria.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.status(e.status).send(e.msg);
    }
  }
});
