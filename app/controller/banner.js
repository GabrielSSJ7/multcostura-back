import ModelCategoria from "../database/mongo/models/categories";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

module.exports = app => ({
  async store(req, res) {
    const { images: imagesBody, id } = req.body;
    const files = req.files;
    console.log("images body ", imagesBody);

    try {
      const categoria = await ModelCategoria.findById(
        mongoose.Types.ObjectId(id)
      );
      if (!categoria) throw { status: 400, msg: "Categoria não encontrada" };
      if (!imagesBody)
        throw { status: 400, msg: "Ocorreu um erro, contate o suporte" };
      const images = JSON.parse(imagesBody);

      const bannerFolderPath = path.join(
        __dirname,
        "../../dist/banners/categories/" + id
      );
      if (!fs.existsSync(bannerFolderPath))
        fs.mkdirSync(bannerFolderPath, { recursive: true });

      const filesBannerFolder = fs.readdirSync(bannerFolderPath);

      if (filesBannerFolder.length > 0) {
        if (categoria.bannerImages.length > 0) {
          categoria.bannerImages.forEach(cb => {
            if (!images.map(img => img.pos).includes(cb.pos)) {
              if (fs.existsSync(bannerFolderPath + "/" + cb.image))
                fs.unlinkSync(bannerFolderPath + "/" + cb.image);
            } else {
              if (images[cb.pos].name != cb.image) {
                if (fs.existsSync(bannerFolderPath + "/" + cb.image))
                  fs.unlinkSync(bannerFolderPath + "/" + cb.image);
              }
            }
          });
        }
      }
      console.log(images);

      categoria.bannerImages = images.map(img => ({
        image: `${img.name}`,
        pos: img.pos
      }));

      await categoria.save();

      files.forEach(file => {
        fs.writeFileSync(
          bannerFolderPath + "/" + file.originalname,
          file.buffer
        );
      });

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
