import ModelCategoria from "../database/mongo/models/categories";
import mongoose from "mongoose";
import Categories from "../utils/categories";
import Institutional from "../utils/institutional";

module.exports = app => ({
  async store(req, res) {
    const { images: imagesBody, id, type } = req.body;
    const files = req.files;
    let response = {};
    switch (type) {
      case "categories":
        // eslint-disable-next-line no-case-declarations
        const categories = new Categories(id);
        response = await categories.saveSlide(files, imagesBody);
        return res.status(response.status).json(response.msg);

      case "homeBanners":
        // eslint-disable-next-line no-case-declarations
        const institutional = new Institutional();
        response = await institutional.saveSlideHome(files, imagesBody);
        return res.status(response.status).json(response.msg);

      default:
        return;
    }
  },
  async index(req, res) {
    const { id } = req.params;

    const banners = await ModelCategoria.findById(id);
    const bannerImages = banners.bannerImages.map(banner => ({
      pos: banner.pos,
      name: banner.image,
      image: `${process.env.STATIC_FILES_URL}banners/categories/${id}/${banner.image}`
    }));
    return res.json(bannerImages);
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
