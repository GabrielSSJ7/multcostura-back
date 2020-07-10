import settingsFactory from "../factory/setting";

export default {
  async store(req, res) {
    const { desativatedFilters } = req.body;
    try {
      const settings = settingsFactory();

      settings.insert({ desativatedFilters }, function (
        err,
        result
      ) {
        if (err) throw err;
        return res.status(200).json(result);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  update(req, res) {
    const { id } = req.params;
    const { desativatedFilters } = req.body;
    try {
      const settings = settingsFactory();

      settings.update({ desativatedFilters }, { _id: id }, function (
        err,
        result
      ) {
        if (err) throw err;
        return res.status(200).json(result);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  index (req, res) {
    try {
      const settings = settingsFactory()
      settings.list({}, function (err, result) {
        if (err) throw err

        return res.status(200).json(result)
      })
    } catch (err) {
      return res.status(500).json(err);
    }
  }
};
