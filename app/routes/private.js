import multer from "multer";
import path from "path";
module.exports = gl => {
  const { categories, manufacturer, reseller, machine } = gl.app.controller;
  gl.route("/categories")
    .post(
      multer({ storage: categoriesStorage }).single("icon"),
      categories.store
    )
    .get(categories.index);
  gl.route("/categories/:id")
    .get(categories.show)
    .put(
      multer({ storage: categoriesStorage }).single("icon"),
      categories.update
    )
    .delete(categories.delete);

  gl.route("/manufacturer")
    .post(
      multer({ storage: manufacturerStorage }).fields([
        { name: "icon" },
        { name: "logo" }
      ]),
      manufacturer.store
    )
    .get(manufacturer.index);
  gl.route("/manufacturer/:id")
    .get(manufacturer.show)
    .delete(manufacturer.delete)
    .put(
      multer({ storage: manufacturerStorage }).fields([
        { name: "icon" },
        { name: "logo" }
      ]),
      manufacturer.update
    );

  gl.route("/reseller")
    .post(reseller.store)
    .get(reseller.index);
  gl.route("/reseller/:id")
    .get(reseller.show)
    .put(reseller.update)
    .delete(reseller.delete);

  gl.route("/machine")
    .post(
      multer({ storage: machineStorage }).array("machines", 5),
      machine.store 
    )
    .get(machine.index);

  gl.route("/machine/:id")
    .put(
      multer({ storage: machineStorage }).array("machines", 5),
      machine.update
    )
    .delete(machine.delete);
};

const machineStorage = multer.memoryStorage();

const manufacturerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = "icons";
    if (file.fieldname == "logo") folder = "logos";
    cb(null, path.join(__dirname, "../../dist/" + folder + "/manufacturer/"));
  },
  filename: function(req, file, cb) {
    const { name } = req.query;
    const extension = file.mimetype.split("/");

    cb(null, `${name.replace(/\s/g, "")}${Date.now()}.${extension[1]}`);
  }
});

const categoriesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../../dist/icons/categories/"));
  },
  filename: function(req, file, cb) {
    const { name } = req.query;
    const extension = file.mimetype.split("/");

    cb(null, `${name.replace(/\s/g, "")}${Date.now()}.${extension[1]}`);
  }
});
