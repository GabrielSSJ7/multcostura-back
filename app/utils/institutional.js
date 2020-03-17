import Model from "../database/mongo/models/institutional";
import path from "path";
import fs from "fs";

export default class {
  async saveBanner(type, file) {
    try {
      const _institutional = await Model.find();
      const institutional = _institutional[0];
      if (!institutional)
        throw { status: 400, msg: "ocorreu um erro tente mais tarde" };

      const bannerFolderPath = path.join(
        __dirname,
        "../../dist/banners/institutional/" + type + "/"
      );
      if (!fs.existsSync(bannerFolderPath))
        fs.mkdirSync(bannerFolderPath, { recursive: true });

      if (fs.existsSync(bannerFolderPath + institutional[type]))
        fs.unlinkSync(bannerFolderPath + institutional[type]);

      fs.writeFileSync(bannerFolderPath + file.originalname, file.buffer);

      institutional[type] = file.originalname;
      await institutional.save();

      return { status: 200, msg: institutional };
    } catch (e) {
      return {
        status: e.status,
        msg: e.msg
      };
    }
  }

  async deleteBannerFixed(type) {
    try {
      const _institutional = await Model.find();
      const institutional = _institutional[0];
      if (!institutional)
        throw { status: 400, msg: "ocorreu um erro tente mais tarde" };

      const bannerFolderPath = path.join(
        __dirname,
        "../../dist/banners/institutional/" + type + "/"
      );
      if (!fs.existsSync(bannerFolderPath))
        fs.mkdirSync(bannerFolderPath, { recursive: true });

      if (fs.existsSync(bannerFolderPath + institutional[type]))
        fs.unlinkSync(bannerFolderPath + institutional[type]);

      institutional[type] = null;
      await institutional.save();
      return { status: 200, msg: institutional };
    } catch (e) {
      return {
        status: e.status,
        msg: e.msg
      };
    }
  }

  async saveSlideHome(files, imagesBody) {
    try {
      const _institutional = await Model.find();
      let institutional = null;
      if (_institutional.length > 0) {
        institutional = _institutional[0];
        if (!institutional)
          throw { status: 400, msg: "ocorreu um erro tente mais tarde" };
      }
      const images = JSON.parse(imagesBody);

      const bannerFolderPath = path.join(
        __dirname,
        "../../dist/banners/institutional/home/"
      );
      if (!fs.existsSync(bannerFolderPath))
        fs.mkdirSync(bannerFolderPath, { recursive: true });

      const filesBannerFolder = fs.readdirSync(bannerFolderPath);

      if (filesBannerFolder.length > 0) {
        if (institutional.homeBanners.length > 0) {
          institutional.homeBanners.forEach(cb => {
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

      let newInst = null;
      if (_institutional.length > 0) {
        institutional.homeBanners = images.map(img => ({
          image: `${img.name}`,
          pos: img.pos
        }));
        await institutional.save();
      } else {
        newInst = await Model.create({
          homeBanners: images.map(img => ({
            image: `${img.name}`,
            pos: img.pos
          }))
        });
      }

      files.forEach(file => {
        fs.writeFileSync(
          bannerFolderPath + "/" + file.originalname,
          file.buffer
        );
      });

      return { status: 200, msg: newInst ? newInst : institutional };
    } catch (e) {
      console.log("e => ", e);

      return {
        status: e.status,
        msg: e.msg
      };
    }
  }
}
