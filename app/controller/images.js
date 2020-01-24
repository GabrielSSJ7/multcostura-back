import fs from "fs";
import path from "path";
import ModelMachine from "../database/mongo/models/machine";

module.exports = () => ({
  async delete(req, res) {
    const { id, type, image } = req.query;
    let finalPath = "";
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
    }
    const folderPath = path.join(
      __dirname,
      `../../dist/machines/${finalPath}/${id}/`
    );
    try {
      if (fs.existsSync(folderPath)) {
        const imagesFolder = fs.readdirSync(folderPath);
        let imageToDelete = "";
        imagesFolder.forEach(img => {
          const nImg = img.split(".");
          if (image == nImg[0]) {
            imageToDelete = img;
          }
        });
        fs.unlinkSync(folderPath + imageToDelete);
      }
      const machine = await ModelMachine.findById(id);
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
      }
      await machine.save();
      return res.status(200).json(machine);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});
