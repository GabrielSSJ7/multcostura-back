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
        position: cat.position,
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
      const { name, description, position, oldPosition } = req.query;
      console.log(req.query)
      const categories = await ModelCategories.findById(id);
      if (categories) {
        categories.name = name;
        categories.description = description;
        if (position && parseInt(position) >= 0 && parseInt(position) <= 8) {
          const allCats = await ModelCategories.find()
            let catToChange = null
            allCats.forEach(cat => {
              console.log(position, cat.position)
              if (position == cat.position)
                catToChange = cat
            })
            console.log("catToChange", catToChange)
            if (catToChange) {
              const _ = 
                await ModelCategories.findById(catToChange._id)
              _.position = 0
              await _.save()
            }
          categories.position = position
          await categories.save()
          return res.json(categories)
        } else {
          return res.status(400).send('Posição informada da categoria é inválida')
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
