import "dotenv/config";
import ModelCategories from "../database/mongo/models/categories";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

module.exports = () => ({
  async store(req, res) {
    const { name, description } = req.query;
    const file = req.file;

    const categories = new ModelCategories();
    categories.name = name;
    categories.description = description;
    if (file) categories.appIcon = file.filename;

    const categoriesReturn = await categories.save();
    return res.status(201).json(categoriesReturn);
  },
  async index(req, res) {
    const categories = await ModelCategories.find();
    const resCategorties = categories.map(cat => {
      return {
        id: cat._id,
        name: cat.name,
        description: cat.description,
        created_at: cat.created_at,
        appIcon: `${process.env.STATIC_FILES_URL}icons/categories/${cat.appIcon}`
      };
    });
    return res.json(resCategorties);
  },
  async show(req, res) {
    const { id } = req.params;
    console.log(id)
    const category = await ModelCategories.findById(
      mongoose.Types.ObjectId(id)
    );
    if (category)
      return res.json({
        name: category.name,
        description: category.description,
        appIcon: category.appIcon,
        bannerImages: category.bannerImages.map(b => ({
          ...category.b,
          image: b.image
            ? `${process.env.STATIC_FILES_URL}banners/categories/${id}/${b.image}`
            : null
        })),
        createdAt: category.createdAt
      });
    return res.status(404).send("Categoria não encontrada");
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.query;
      const categories = await ModelCategories.findById(id);
      if (categories) {
        categories.name = name;
        categories.description = description;
        const file =
          path.join(__dirname, "../../dist") +
          "/icons/categories/" +
          categories.appIcon;

        if (fs.existsSync(file)) {
          if (req.file) {
            fs.unlinkSync(file);
            categories.appIcon = req.file.filename;
          }
        } else {
          if (req.file) {
            categories.appIcon = req.file.filename;
            console.log("App icon changed => ", categories.appIcon);
          }
        }

        const responseCategories = await categories.save();
        return res.json(responseCategories);
      } else {
        return res.status(400).send(`ID ${id} não encontrado`);
      }
    } catch (e) {
      return res.status(400).send(e.toString());
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    const category = await ModelCategories.findById(id);
    if (category) {
      if (category.appIcon) {
        const file =
          path.join(__dirname, "../../dist") +
          "/icons/categories/" +
          category.appIcon;

        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }

      const bannersFolder = path.join(
        __dirname,
        "../../dist/banners/categories/" + id
      );

      fs.rmdirSync(bannersFolder, { recursive: true });

      ModelCategories.deleteOne({ _id: id }, function(err) {
        if (err) return res.status(500).send(err);
        return res.sendStatus(200);
      });
    } else {
      return res.status(400).send("Categoria não encontrada");
    }
  }
});
