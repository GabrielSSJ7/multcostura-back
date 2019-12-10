import ModelReseller from "../database/mongo/models/reseller";
import { getLatAndLonByAddress } from "../utils/maps";
module.exports = () => ({
  async store(req, res) {
    const { name, phone, email, address } = req.body;
    if (!name) return res.status(400).send("O nome é necessário");
    if (!phone) return res.status(400).send("O telefone é necessário");
    if (!email) return res.status(400).send("O e-mail é necessário");
    if (!address.publicPlace)
      return res.status(400).send("O logradouro é necessário");
    if (!address.district) return res.status(400).send("A cidade é necessária");
    if (!address.number)
      return res.status(400).send("O número do local é necessário");
    if (!address.state) return res.status(400).send("O estado é necessário");
    if (!address.country) return res.status(400).send("O país é necessário");
    req.body.maps = getLatAndLonByAddress(address);
    const reseller = await ModelReseller.create(req.body);
    return res.status(201).json(reseller);
  },
  async index(req, res) {
    const reseller = await ModelReseller.find();
    const resReseller = reseller.map(res => {
      return {
        id: res._id,
        name: res.name,
        phone: res.phone,
        email: res.email,
        address: res.address,
        maps: res.maps
      };
    });
    return res.json(resReseller);
  },
  async show(req, res) {
    const { id } = req.params;

    const reseller = await ModelReseller.findById(id);
    if (reseller) {
      return res.json({
        id: reseller._id,
        name: reseller.name,
        phone: reseller.phone,
        email: reseller.email,
        address: reseller.address,
        maps: reseller.maps
      });
    } else {
      return res.status(400).send(`ID ${id} não encontrado`);
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, phone, email, address, maps } = req.body;
    const reseller = await ModelReseller.findById(id);
    if (reseller) {
      reseller.name = name;
      (reseller.phone = phone), (reseller.email = email);
      (reseller.address = address), (reseller.maps = maps);
      const responseReseller = await reseller.save();
      return res.json(responseReseller);
    } else {
      return res.status(400).send(`ID ${id} não encontrado`);
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    const reseller = await ModelReseller.findById(id);
    if (reseller) {
      ModelReseller.deleteOne({ _id: id }, function(err) {
        if (err) return res.status(500).send(err);
        return res.sendStatus(200);
      });
    } else {
      return res.status(400).send(`ID ${id} não encontrado`);
    }
  }
});
