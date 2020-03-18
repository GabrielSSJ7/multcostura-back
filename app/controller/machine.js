import ModelMachine from "../database/mongo/models/machine";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fieldValidation } from "../utils/validations";
import { replaceFile } from "../utils/fs";

module.exports = () => ({
  async store(req, res) {
    const {
      machines: machinesFiles,
      productReferences: productRefFiles,
      sewingType: sewingTypeFiles,
      folheto,
      manual
    } = req.files;
    // console.log("folheto", folheto)
    // console.log("manual", manual)
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
      manufacturer,
      description,
      category,
      mainFeatures
    });
    if (!fail.return)
      return res.status(400).send(`${fail.message} ${fail.field}`);
    const machine = new ModelMachine();
    machine.name = name;
    machine.manufacturer = manufacturer;
    machine.description = description;
    machine.video = video;
    machine.category = category;
    machine.mainFeatures = mainFeatures;
    machine.specifications = specifications ? JSON.parse(specifications) : null;
    let machineCreated = await machine.save();
    // MACHINES WRITE FILES
    if (machinesFiles) {
      if (machinesFiles.length > 0) {
        const images = machinesFiles.map((file, i) => {
          const mimeType = file.mimetype.split("/");
          const filePath = path.join(__dirname, "../../dist/machines/images/");
          if (!fs.existsSync(filePath + machineCreated._id + "/"))
            fs.mkdirSync(filePath + machineCreated._id + "/", {
              recursive: true
            });
          fs.writeFileSync(
            `${filePath}${machineCreated._id}/${i}.${mimeType[1]}`,
            file.buffer
          );
          return `/${machineCreated._id}/${i}.${mimeType[1]}`;
        });
        machineCreated.images = images;
        // PRODUCT THAT MACHINE MADES WRITE FILES
        if (productRefFiles) {
          machineCreated.productRef = productRefFiles.map((file, i) => {
            const mimeType = file.mimetype.split("/");
            const filePath = path.join(
              __dirname,
              "../../dist/machines/product_ref/"
            );
            if (!fs.existsSync(filePath + machineCreated._id + "/"))
              fs.mkdirSync(filePath + machineCreated._id + "/", {
                recursive: true
              });
            fs.writeFileSync(
              `${filePath}${machineCreated._id}/${i}.${mimeType[1]}`,
              file.buffer
            );
            return `/${machineCreated._id}/${i}.${mimeType[1]}`;
          });
        }
        // SEWING TYPE WRITE FILE
        if (sewingTypeFiles) {
          const sewingList = sewingTypeFiles.map((file, i) => {
            const mimeType = file.mimetype.split("/");
            const filePath = path.join(
              __dirname,
              "../../dist/machines/sewing_type/"
            );
            if (!fs.existsSync(filePath + machineCreated._id + "/"))
              fs.mkdirSync(filePath + machineCreated._id + "/", {
                recursive: true
              });
            fs.writeFileSync(
              `${filePath}${machineCreated._id}/${i}.${mimeType[1]}`,
              file.buffer
            );
            return `/${machineCreated._id}/${i}.${mimeType[1]}`;
          });
          machineCreated.sewingType = sewingList[0];
        }

        // folheto FILE
        if (folheto) {
            const mimeType = folheto[0].mimetype.split("/");
            const filePath = path.join(
              __dirname,
              "../../dist/machines/folheto/"
            );
            if (!fs.existsSync(filePath + machineCreated._id + "/"))
              fs.mkdirSync(filePath + machineCreated._id + "/", {
                recursive: true
              });
            fs.writeFileSync(
              `${filePath}${machineCreated._id}/${folheto[0].originalname}.${mimeType[1]}`,
              folheto[0].buffer
            );
        
          machineCreated.files.folheto = `/${machineCreated._id}/${folheto[0].originalname}.${mimeType[1]}`;
        }

        // manual FILE
        if (manual) {
            const mimeType = manual[0].mimetype.split("/");
            const filePath = path.join(
              __dirname,
              "../../dist/machines/manual/"
            );
            if (!fs.existsSync(filePath + machineCreated._id + "/"))
              fs.mkdirSync(filePath + machineCreated._id + "/", {
                recursive: true
              });
            fs.writeFileSync(
              `${filePath}${machineCreated._id}/${manual[0].originalname}.${mimeType[1]}`,
              manual[0].buffer
            );
        
          machineCreated.files.manual = `/${machineCreated._id}/${manual[0].originalname}.${mimeType[1]}`;
        }

        await machineCreated.save();
      } else {
        return res.status(400).send("É necessário subir ao menos uma imagem")
      }
    } else {
      return res.status(400).send("É necessário subir ao menos uma imagem")
    }
    return res.json(machineCreated);
  },
  async index(req, res) {
    const { manufacturer, categories, search, filters, order } = req.query;
    let filtersJson = {}
    if (filters) {
      filtersJson = JSON.parse(filters)
    }

    let filtersParsed = {}
    const filtersKey = Object.keys(filtersJson)
    filtersKey.forEach(k => {
      if (filtersJson[k]) {
        const name = `specifications.${k}`
        filtersParsed = {...filtersParsed, [name]: filtersJson[k] }
      }
    })


    let filter = [{}];
    if (manufacturer && manufacturer != "undefined" && manufacturer != "null") {
      if (categories && categories != "undefined" && categories != "null") {
        filter = [{
          "category": categories },
          { "manufacturer": mongoose.Types.ObjectId(manufacturer) }
        ];
      } else {
        filter = [{ "manufacturer": mongoose.Types.ObjectId(manufacturer) }];
      }
    } else if (categories && categories != "undefined" && categories != "null")
      filter = [{ category: mongoose.Types.ObjectId(categories) }];

      if (search && search != "undefined" && search != "null")
        filter = [...filter, { name: new RegExp("^" + search, "gi") }]

    filter = [...filter, filtersParsed]
    const machines = await ModelMachine.find({ $and: filter }).sort(order).populate('category').populate('manufacturer');
    if (machines.length > 0) {
      const responseMachines = machines.map(machine => {
        return {
          id: machine._id,
          name: machine.name,
          description: machine.description,
          mainFeatures: machine.mainFeatures,
          specifications: machine.specifications,
          video: machine.video,
          folheto: machine.files.folheto ? `${process.env.STATIC_FILES_URL}machines/folheto${machine.files.folheto}` : null,
          manual: machine.files.manual ? `${process.env.STATIC_FILES_URL}machines/manual${machine.files.manual}` : null,
          images: machine.images.map(
            img => `${process.env.STATIC_FILES_URL}machines/images${img}`
          ),
          productRef: machine.productRef
            ? machine.productRef.map(
                img =>
                  `${process.env.STATIC_FILES_URL}machines/product_ref${img}`
              )
            : null,
          sewingType: machine.sewingType
            ? `${process.env.STATIC_FILES_URL}machines/sewing_type${machine.sewingType}`
            : null,
          category: machine.category,
          manufacturer: machine.manufacturer,
	  createdAt: machine.createdAt
        };
      });
      return res.json(responseMachines);
    } else {
      return res.status(400).send("Nenhuma máquina encontrada ");
    }
  },
  async show(req, res) {
    const { id } = req.params;

    // const machine = await ModelMachine.findById(id);
    let machine = await ModelMachine.findById(mongoose.Types.ObjectId(id)).populate('category');
    console.log("machine ", machine)
    if (machine) {
      return res.json({
        id: machine._id,
        name: machine.name,
        description: machine.description,
        mainFeatures: machine.mainFeatures,
        specifications: machine.specifications,
        video: machine.video,
        folheto: machine.files.folheto ? `${process.env.STATIC_FILES_URL}machines/folheto${machine.files.folheto}` : null,
        manual: machine.files.manual ? `${process.env.STATIC_FILES_URL}machines/manual${machine.files.manual}` : null,
        images: machine.images.map(
          img => `${process.env.STATIC_FILES_URL}machines/images${img}`
        ),
        productRef: machine.productRef
          ? machine.productRef.map(
              img => `${process.env.STATIC_FILES_URL}machines/product_ref${img}`
            )
          : null,
        sewingType: machine.sewingType
          ? `${process.env.STATIC_FILES_URL}machines/sewing_type${machine.sewingType}`
          : null,
        category: machine.category,
        manufacturer: machine.manufacturer
      });
    } else {
      return res.status(400).send("Máquina não encontrada");
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
      specifications,
      folheto,
      manual
    } = req.body;
    const files = req.files;

    if (!id) return res.status(400).send("ID não informado");
    const machine = await ModelMachine.findById(id);
    if (machine) {
      let fail = fieldValidation({
        name,
        manufacturer,
        category,
        description,
        mainFeatures
      });
      if (!fail.return)
        return res.status(400).send(`${fail.message} ${fail.field}`);

      machine.video = video;
      machine.name = name;
      machine.manufacturer = manufacturer;
      machine.category = category;
      machine.description = description;
      machine.mainFeatures = mainFeatures;
      if (specifications) machine.specifications = JSON.parse(specifications);

      if (replaceFile(files, "machines", id)) {
        let images = [];
        const filePath = path.join(__dirname, `../../dist/machines/images/`);
        images = fs.readdirSync(`${filePath}${id}`);
        images = images.map(img => `/${id}/${img}`);

        machine.images = images;
      }

      if (replaceFile(files, "productReferences", id)) {
        let images = [];
        const filePath = path.join(
          __dirname,
          `../../dist/machines/product_ref/`
        );
        images = fs.readdirSync(`${filePath}${id}`);
        images = images.map(img => `/${id}/${img}`);

        machine.productRef = images;
      }
      if (replaceFile(files, "sewingType", id)) {
        let images = [];
        const filePath = path.join(
          __dirname,
          `../../dist/machines/sewing_type/`
        );
        images = fs.readdirSync(`${filePath}${id}`);
        images.forEach(img => (images = `/${id}/${img}`));
        console.log("sewing = > ", files);
        machine.sewingType = images;
      }

      if (files.folheto) {
        if (files.folheto.length > 0) {
            const filePath = path.join(
              __dirname,
              `../../dist/machines/folheto/`
            );

           if (!fs.existsSync(filePath + id))
            fs.mkdirSync(filePath + id, {recursive: true});

           const filesFolder = fs.readdirSync(`${filePath}${id}`);

            if (filesFolder.length > 0)
              filesFolder.forEach(img => {
                const originalname = files.folheto[0].originalname;
                const _originalname = files.folheto[0].originalname.split('.');
                const fileFolderName = img.split('.');
                fs.unlinkSync(`${filePath}${id}/${img}`);
                fs.writeFileSync(
                  `${filePath}${id}/${originalname}`,
                  files.folheto[0].buffer,
                );
              })
          let images = [];       
          images = fs.readdirSync(`${filePath}${id}`);
          images.forEach(img => (images = `/${id}/${img}`));
          machine.files.folheto = images;
        }
      }

      if (files.manual) {
        if (files.manual.length > 0) {
          const filePath = path.join(
            __dirname,
            `../../dist/machines/manual/`
          );

           if (!fs.existsSync(filePath + id))
            fs.mkdirSync(filePath + id, {recursive: true});

           const filesFolder = fs.readdirSync(`${filePath}${id}`);

            if (filesFolder.length > 0)
              filesFolder.forEach(img => {
                const originalname = files.manual[0].originalname;
                const _originalname = files.manual[0].originalname.split('.');
                const fileFolderName = img.split('.');
                console.log(fileFolderName[0], _originalname[0])
                fs.unlinkSync(`${filePath}${id}/${img}`);
                fs.writeFileSync(
                  `${filePath}${id}/${originalname}`,
                  files.manual[0].buffer,
                );
              })
          let images = [];
         
          images = fs.readdirSync(`${filePath}${id}`);
          images.forEach(img => (images = `/${id}/${img}`));
          machine.files.manual = images;
        }
      }


      const machineReturn = await machine.save();
      return res.json(machineReturn);
    } else {
      return res.status(400).send("Máquina não encontrada");
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID não informado");
    const machine = await ModelMachine.findById(id);
    if (machine) {
      machine.images.forEach(img => {
        const filePath = path.join(__dirname, "../../dist/machines/images");
        if (fs.existsSync(filePath + img)) {
          fs.unlinkSync(filePath + img);
        }
      });
      ModelMachine.deleteOne({ _id: id }, function(err) {
        if (err) return res.status(500).send(err);
        return res.sendStatus(200);
      });
    }
  }
});
