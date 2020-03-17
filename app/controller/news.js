import ModelNews from "../database/mongo/models/news";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Validate from "../utils/validations";

export default {
  async store(req, res) {
    const { title, description, date } = req.body;
    const resultValidation = Validate.fieldValidation({
      titulo: title,
      ["descrição"]: description,
      data: date
    });
    if (!resultValidation.return)
      return res
        .status(400)
        .send(`${resultValidation.message} ${resultValidation.field}`);

    const news = await ModelNews.create({ title, description, date });

    return res.json(news);
  },

  async index(req, res) {
    const { search } = req.query;
    let filter = null;
    if (search) filter = { title: new RegExp("^" + search, "gi") };
    let news = await ModelNews.find(filter).sort({ createdAt: -1 });
    news = news.map(news => {
      return { 
        _id: news._id,
        gallery: {
          images: news.gallery.images = news.gallery.images.map(img => `${process.env.STATIC_FILES_URL}news/${news._id}/gallery/images/${img}`),
          videos: news.gallery.videos = news.gallery.videos.map(vid => `${process.env.STATIC_FILES_URL}news/${news._id}/gallery/videos/${vid}`)
        },
        title: news.title,
        description: news.description,
        date: news.date
      }
    })
    return res.json(news);
  },

  del(req, res) {
    const { id } = req.params;

    ModelNews.deleteOne({ _id: mongoose.Types.ObjectId(id) }, function(err, r) {
      if (err) {
        console.log(err);
        return res.status(500).send("Ocorreu um erro, contato o suporte");
      }

      const folderPath = path.join(__dirname, "../../dist/news/" + id);

      fs.rmdirSync(folderPath, { recursive: true });

      return res.sendStatus(200);
    });
  },

  async show(req, res) {
    const { id } = req.params;

    if (!id) return res.status(400).send("ID não enviado, contate o suporte");
    const news = await ModelNews.findById(id);
    if (!news) return res.status(400).send("Nenhuma notícia encontrada");
    news.gallery.images = news.gallery.images.map(
      img => `${process.env.STATIC_FILES_URL}news/${id}/gallery/images/${img}`
    );
    news.gallery.videos = news.gallery.videos.map(
      video =>
        `${process.env.STATIC_FILES_URL}news/${id}/gallery/videos/${video}`
    );
    return res.json(news);
  },

  async update(req, res) {
    const { id } = req.params;
    const { title, description, date } = req.body;
    if (!id) return res.status(400).send("ID não enviado, contate o suporte");
    const news = await ModelNews.findById(id);
    if (!news) return res.status(400).send("Nenhuma notícia encontrada");

    if (title) news.title = title;
    if (description) news.description = description;
    if (date) news.date = date;

    await news.save();
    return res.json(news);
  }
};
