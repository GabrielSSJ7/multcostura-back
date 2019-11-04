import ModelCategories from "../database/mongo/models/categories";
import path from "path";
import fs from "fs";

module.exports = app => ({
  async store(req, res) {
    const { name, description } = req.query;
    const file = req.file;
    const categories = new ModelCategories();
    categories.name = name;
    categories.description = description;
    categories.appIcon = file.filename;
    console.log(file);
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
    const category = await ModelCategories.findById(id);

    return res.json({
      name: category.name,
      description: category.description,
      appIcon: category.appIcon,
      createdAt: category.createdAt
    });
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, description } = req.query;
    const categories = await ModelCategories.findById(id);
    if (categories) {
      categories.name = name;
      categories.description = description;
      console.log("file in update => ", req.file);
      const file =
        path.join(__dirname, "../../dist") +
        "/icons/categories/" +
        categories.appIcon;

      if (fs.existsSync(file)) {
        if (req.file) {
          fs.unlinkSync(file);
          categories.appIcon = req.file.filename;
          console.log("App icon changed true => ", categories.appIcon);
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
  },
  async delete(req, res) {
    const { id } = req.params;
    const category = await ModelCategories.findById(id);
    const file =
      path.join(__dirname, "../../dist") +
      "/icons/categories/" +
      category.appIcon;

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    ModelCategories.deleteOne({ _id: id }, function(err) {
      if (err) return res.status(500).send(err);
      return res.sendStatus(200);
    });
  }
});
