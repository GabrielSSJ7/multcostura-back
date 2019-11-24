import path from 'path';
import fs from 'fs';

module.exports = {
  replaceFile(files, typeFiles, id) {
    if (files[typeFiles]) {
      let filePath = null;
      switch (typeFiles) {
        case 'machines':
          filePath = path.join(__dirname, `../../dist/machines/images/`);
          break;
        case 'productReferences':
          filePath = path.join(__dirname, `../../dist/machines/product_ref/`);
          break;
        case 'sewingType':
          filePath = path.join(__dirname, `../../dist/machines/sewing_type/`);
          break;
      }
      if (files[typeFiles].length > 0) {
        if (!fs.existsSync(filePath + id))
          fs.mkdirSync(filePath + id, {recursive: true});
        const filesFolder = fs.readdirSync(`${filePath}${id}`);
        if (filesFolder.length > 0)
          filesFolder.forEach(img => {
            console.log('img => ', img);
            files[typeFiles].forEach(file => {
              console.log('file => ', file);
              const originalname = file.originalname;
              const _originalname = file.originalname.split('.');
              const fileFolderName = img.split('.');
              if (fileFolderName[0] == _originalname[0]) {
                fs.unlinkSync(`${filePath}${id}/${img}`);
                fs.writeFileSync(
                  `${filePath}${id}/${originalname}`,
                  file.buffer,
                );
              } else {
                fs.writeFileSync(
                  `${filePath}${id}/${originalname}`,
                  file.buffer,
                );
              }
            });
          });
        else
          files[typeFiles].forEach(file => {
            console.log('file => ', file);

            const originalname = file.originalname;
            fs.writeFileSync(`${filePath}${id}/${originalname}`, file.buffer);
          });

        return true;
      }
      return false;
    }
    return false;
  },
};