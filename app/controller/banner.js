import ModelCategoria from '../database/mongo/models/categories';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

module.exports = app => ({
  async store(req, res) {
    const {img, title, description, txtBtn, link, show} = req.body;
    const {id} = req.query;
    const file = req.file;
    try {
      const categoria = await ModelCategoria.findById(
        mongoose.Types.ObjectId(id),
      );
      if (!categoria) throw {status: 400, msg: 'Categoria não encontrada'};
      categoria.banner.title = title;
      categoria.banner.description = description;
      categoria.banner.txtBtn = txtBtn;
      categoria.banner.link = link;
			categoria.banner.show = show;

      if (file) {
        const fileTypeArr = file.mimetype.split('/');
        const fileName = `${id}.${fileTypeArr[1]}`;
        const imgPath = path.join(
          __dirname,
          `../../dist/banner/categories/${id}/`,
        );
        if (!fs.existsSync(path)) {
          fs.mkdirSync(imgPath, {recursive: true});
          fs.writeFileSync(`${imgPath}${fileName}`, file.buffer);
        } else {
          fs.writeFileSync(`${imgPath}${fileName}`, file.buffer);
        }
        categoria.banner.image = `/${id}/${fileName}`;
      }
			console.log(img)	
				if (img == 'null') {
				console.log('excluding image')
				const imgPath = path.join(
          __dirname,
          `../../dist/banner/categories`,
        );
				fs.unlinkSync(`${imgPath}${categoria.banner.image}`)
				categoria.banner.image = null
			}
			
      await categoria.save();
      return res.status(200).json(categoria);
    } catch (e) {
      return res.status(e.status).send(e.msg);
    }
  },
  async update(req, res) {
    const {id, } = req.body;
    try {
      const categoria = await ModelCategoria.findById(
        mongoose.Types.ObjectId(id),
      );
      if (!categoria) throw {status: 404, msg: 'Categoria não encontrada'};
      categoria.banner.show = show;
      await categoria.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.status(e.status).send(e.msg);
    }
  },
});
