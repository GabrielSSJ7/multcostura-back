module.exports = {
  fieldValidation(object) {
    let _return = { return: true, message: "", field: "" };
    Object.keys(object).forEach(function(key) {
      if (!object[key]) {
        _return = { return: false, message: "Campo vazio: ", field: key };
      }
    });
    return _return;
  }
};
