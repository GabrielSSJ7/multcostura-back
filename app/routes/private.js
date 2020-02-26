import multer from 'multer'
import path from 'path'
import { getLatAndLonByAddress } from '../utils/maps'
import institutional from '../controller/institutional'
import gallery from '../controller/gallery'
import news from '../controller/news'
import tools from '../controller/tools'

module.exports = gl => {
  const {
    categories,
    manufacturer,
    reseller,
    machine,
    images,
    banner
  } = gl.app.controller

  gl.route('/categories')
    .post(
      multer({ storage: categoriesStorage }).single('icon'),
      categories.store
    )
    
  gl.route('/categories/:id')
   
    .put(
      multer({ storage: categoriesStorage }).single('icon'),
      categories.update
    )
    .delete(categories.delete)

  gl.route('/manufacturer')
    .post(
      multer({ storage: manufacturerStorage }).fields([
        { name: 'icon' },
        { name: 'logo' }
      ]),
      manufacturer.store
    )
    
  gl.route('/manufacturer/:id')
    .get(manufacturer.show)
    .delete(manufacturer.delete)
    .put(
      multer({ storage: manufacturerStorage }).fields([
        { name: 'icon' },
        { name: 'logo' }
      ]),
      manufacturer.update
    )

  gl.route('/reseller')
    .post(reseller.store)
  
  gl.route('/reseller/:id')
    .get(reseller.show)
    .put(reseller.update)
    .delete(reseller.delete)

  gl.route('/machine')
    .post(
      multer({ storage: machineStorage }).fields([
        {
          name: 'machines',
          maxCount: 5
        },
        {
          name: 'productReferences',
          maxCount: 4
        },
        {
          name: 'sewingType',
          maxCount: 1
        },
        {
          name: 'folheto',
          maxCount: 1
        },
        {
          name: 'manual',
          maxCount: 1
        }
      ]),
      machine.store
    )
    

  gl.route('/machine/:id')
    .put(
      multer({ storage: machineStorage }).fields([
        {
          name: 'machines',
          maxCount: 5
        },
        {
          name: 'productReferences',
          maxCount: 4
        },
        {
          name: 'sewingType',
          maxCount: 1
        },
          {
          name: 'folheto',
          maxCount: 1
        },
        {
          name: 'manual',
          maxCount: 1
        }
      ]),
      machine.update
    )
    .delete(machine.delete)

  gl.route('/images').delete(images.delete)
  gl.route('/banner').post(
    multer({ store: memoryStorage }).array('img', 10),
    banner.store
  )
  gl.route('/banner/:id/:show').put(
    multer({ store: memoryStorage }).array('img', 6),
    banner.update
  )

  gl.route('/institutional').post(
    multer({ store: memoryStorage }).array('img', 6),
    institutional.store
  )

  gl.route('/institutional/:type').delete(institutional.delete)

  gl.route('/news').post(news.store)

  gl.route('/news/:id')
    .put(news.update)
    .delete(news.del)

  gl.route('/gallery').post(
    multer({ storage: memoryStorage }).single('img'),
    gallery.store
  )
  gl.route('/gallery/:id').delete(gallery.delete)
  gl.route('/tools').post(
    multer({ store: memoryStorage }).array('toolsFiles', 6), tools.store
  )
  gl.route('/tools/:id')
    .delete(tools.delete )
    .put(
      multer({ store: memoryStorage }).array('toolsFiles', 6), tools.update
    )
}

const memoryStorage = multer.memoryStorage()

const machineStorage = multer.memoryStorage()

const manufacturerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = 'icons'
    if (file.fieldname == 'logo') folder = 'logos'
    cb(null, path.join(__dirname, '../../dist/' + folder + '/manufacturer/'))
  },
  filename: function(req, file, cb) {
    const { name } = req.query
    const extension = file.mimetype.split('/')

    cb(null, `${name.replace(/\s/g, '')}${Date.now()}.${extension[1]}`)
  }
})

const categoriesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../dist/icons/categories/'))
  },
  filename: function(req, file, cb) {
    const { name } = req.query
    const extension = file.mimetype.split('/')

    cb(null, `${name.replace(/\s/g, '')}${Date.now()}.${extension[1]}`)
  }
})
