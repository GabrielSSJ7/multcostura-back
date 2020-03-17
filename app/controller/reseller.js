import ModelReseller from "../database/mongo/models/reseller";
import { getLatAndLonByAddress } from "../utils/maps";
module.exports = () => ({
  async store(req, res) {
    const { name, phone, email, address, geocode } = req.body;
    console.log("geocode", geocode);
    if (!name) return res.status(400).send("O nome é necessário");
    if (!phone) return res.status(400).send("O telefone é necessário");
    if (!email) return res.status(400).send("O e-mail é necessário");
    
    if (!address) return res.status(400).send("O endereço não foi informado")

    if (!geocode) return res.status(400).send("Não foi possível encontrar este endereço no mapa!")

    const reseller = await ModelReseller.create({ name, phone, email, address, maps: { lat: geocode.lat, lng: geocode.lng }});

    return res.status(201).json(reseller)

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
