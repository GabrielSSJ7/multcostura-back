import mongoose from "mongoose";
import ModelCategoria from "../database/mongo/models/categories";
import path from "path";
import fs from "fs";

export default class {
  constructor(id) {
    this.id = id;
  }

  async saveSlide(files, imagesBody) {
    const { id } = this;
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
              if (!images.map(img => img.name).includes(cb.image)) {
                if (fs.existsSync(bannerFolderPath + "/" + cb.image))
                  fs.unlinkSync(bannerFolderPath + "/" + cb.image);
              }
            }
          });
        }
      }

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

      return { status: 200, msg: categoria };
    } catch (e) {
      return {
        status: e.status,
        msg: e.msg
      };
    }
  }
}
