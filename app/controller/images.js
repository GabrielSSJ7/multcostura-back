import fs from "fs";
import path from "path";
import ModelMachine from "../database/mongo/models/machine";
import ModelTools from '../database/mongo/models/tools'

module.exports = () => ({
  async delete(req, res) {
    const { id, type, image } = req.query;
    let finalPath = "";
    let _folder = "machines"
    switch (type) {
      case "machine":
        finalPath = "images";
        break;
      case "productRef":
        finalPath = "product_ref";
        break;
      case "sewingType":
        finalPath = "sewing_type";
        break;

      case "tools":
        finalPath = "images"
        _folder = "tools"
    }
    const folderPath = path.join(
      __dirname,
      `../../dist/${_folder}/${finalPath}/${id}/`
    );
    try {
      if (fs.existsSync(folderPath)) {
        const imagesFolder = fs.readdirSync(folderPath);
        
        let imageToDelete = "";
        imagesFolder.forEach(img => {
          const nImg = img.split(".");
          console.log(image, "==", nImg[0])
          if (image == nImg[0]) {
            imageToDelete = img;
          }
        });
        console.log("imageToDelete => ", imageToDelete)
        console.log("FOLDER PATH => ", folderPath + imageToDelete);
        fs.unlinkSync(folderPath + imageToDelete);
      }
      const machine = await ModelMachine.findById(id);
      const tool = await ModelTools.findById(id)
      switch (type) {
        case "machine":
          machine.images.forEach((item, index) => {
            let arrNameDbImage = item.split("/");
            let nameDbImage = arrNameDbImage[arrNameDbImage.length - 1];
            let arrName = nameDbImage.split(".");
            if (image == arrName[0]) machine.images.splice(index, 1);
          });
          break;
        case "productRef":
          machine.productRef.forEach((item, index) => {
            let arrNameDbImage = item.split("/");
            let nameDbImage = arrNameDbImage[arrNameDbImage.length - 1];
            let arrName = nameDbImage.split(".");
            if (image == arrName[0]) {
              machine.productRef.splice(index, 1);
            }
          });
          break;
        case "sewingType":
          machine.sewingType = null;
          break;

        case "tools":
          tool.images.forEach((item, index) => {
            let arrNameDbImage = item.split("/");
            let nameDbImage = arrNameDbImage[arrNameDbImage.length - 1];
            let arrName = nameDbImage.split(".");
            if (image == arrName[0]) tool.images.splice(index, 1);
          });
        break;

      }
      if (tool)
        await tool.save();
      if (machine)
        await machine.save();
      return res.status(200).json(_folder == "machines" ? machine : tool);
    } catch (err) {
      console.log(err)
      return res.status(500).json(err);
    }
  }
});
