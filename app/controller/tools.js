import ModelTools from '../database/mongo/models/tools'
import { fieldValidation } from '../utils/validations'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import { replaceFileTool } from "../utils/fs";

export default {
	async store(req, res) {
    const toolsFiles = req.files;
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
      description,
    });
    if (!fail.return)
      return res.status(400).send(`${fail.message} ${fail.field}`);
    const tools = new ModelTools();
    tools.name = name;
    tools.manufacturer = manufacturer;
    tools.description = description;
    tools.video = video ? JSON.parse(video) : null;
    tools.category = category;
    tools.mainFeatures = mainFeatures;
    tools.specifications = specifications ? JSON.parse(specifications) : null;
    let toolsCreated = await tools.save();
    // MACHINES WRITE FILES
    if (toolsFiles) {
      if (toolsFiles.length > 0) {
        const images = toolsFiles.map((file, i) => {
          const mimeType = file.mimetype.split("/");
          const filePath = path.join(__dirname, "../../dist/tools/images/");
          if (!fs.existsSync(filePath + toolsCreated._id + "/"))
            fs.mkdirSync(filePath + toolsCreated._id + "/", {
              recursive: true
            });
          fs.writeFileSync(
            `${filePath}${toolsCreated._id}/${i}.${mimeType[1]}`,
            file.buffer
          );
          return `/${toolsCreated._id}/${i}.${mimeType[1]}`;
        });
        toolsCreated.images = images;
        // SEWING TYPE WRITE FILE
        await toolsCreated.save();
      }
    }
    return res.json(toolsCreated);
  },
  async index(req, res) {
    const { manufacturer, category, search } = req.query;
    
    let filter = [{}];
    if (manufacturer && manufacturer != "undefined" && manufacturer != "null") {
      if (category && category != "undefined" && category != "null") {
        filter = [{
          "category": mongoose.Types.ObjectId(category) },
          { "manufacturer": mongoose.Types.ObjectId(manufacturer) }
        ];
      } else {
        filter = [{ "manufacturer": mongoose.Types.ObjectId(manufacturer) }];
      }
    } else if (category && category != "undefined" && category != "null")
      filter = [{ category: mongoose.Types.ObjectId(category) }];

      if (search && search != "undefined" && search != "null")
        filter = [...filter, { name: new RegExp("^" + search, "gi") }]

    const tools = await ModelTools.find({ $and: filter }).populate('category').populate('manufacturer');
    if (tools.length > 0) {
      const responseTools = tools.map(tool => {
        return {
          id: tool._id,
          name: tool.name,
          description: tool.description,
          mainFeatures: tool.mainFeatures,
          specifications: tool.specifications,
          video: tool.video,
          images: tool.images.map(
            img => `${process.env.STATIC_FILES_URL}tools/images${img}`
          ),
          category: tool.category,
          manufacturer: tool.manufacturer
        };
      });
      return res.json(responseTools);
    } else {
      return res.status(400).send("Nenhuma peça encontrada ");
    }
  },
  async show(req, res) {
    const { id } = req.params;

    // const machine = await ModelTools.findById(id);
    let tools = await ModelTools.aggregate([
      {
        $match: id ? { _id: mongoose.Types.ObjectId(id) } : {}
      }
    ]);
    if (tools) {
      tools = tools[0];
      console.log(tools)
      return res.json({
        id: tools._id,
        name: tools.name,
        description: tools.description,
        mainFeatures: tools.mainFeatures,
        specifications: tools.specifications,
        video: tools.video,
        images: tools.images.map(
          img => `${process.env.STATIC_FILES_URL}tools/images${img}`
        ),
        category: tools.category,
        manufacturer: tools.manufacturer
      });
    } else {
      return res.status(400).send("Peça não encontrada");
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
    const tool = await ModelTools.findById(id);
    if (tool) {
      let fail = fieldValidation({
        name,
        description,
        mainFeatures
      });
      if (!fail.return)
        return res.status(400).send(`${fail.message} ${fail.field}`);
      tool.video = video;
      tool.name = name;
      tool.manufacturer = manufacturer ? manufacturer : null;
      tool.category = category;
      tool.description = description;
      tool.mainFeatures = mainFeatures;

      if (replaceFileTool(files, id)) {
        let images = [];
        const filePath = path.join(__dirname, `../../dist/tools/images/`);
        images = fs.readdirSync(`${filePath}${id}`);
        images = images.map(img => `/${id}/${img}`);

        tool.images = images;
      }
      const toolReturn = await tool.save();
      return res.json(toolReturn);
    } else {
      return res.status(400).send("Máquina não encontrada");
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID não informado");
    const tool = await ModelTools.findById(id);
    if (tool) {
      const filePath = path.join(__dirname, "../../dist/tools/images");
      tool.images.forEach(img => {
        
        if (fs.existsSync(filePath + img)) {
          fs.unlinkSync(filePath + img);
        }
      });
      //fs.unlinkSync(filePath)
      ModelTools.deleteOne({ _id: id }, function(err) {
        if (err) return res.status(500).send(err);
        return res.sendStatus(200);
      });
    }
  }
}