import "dotenv/config";
import bcrypt from "bcrypt";
import { fieldValidation } from "../utils/validations";
import ModelUser from "../database/mongo/models/user";
import jwt from "jwt-simple";
const saltRounds = 10;
module.exports = app => ({
  async store(req, res) {
    const { name, email, cpf, password } = req.body;
    const fail = fieldValidation({ name, email, cpf, password });
    if (!fail.return) {
      return res.status(400).send(`${fail.message} ${fail.field}`);
    }
    const user = await ModelUser.findOne({ $or: [{ name }, { email }] });
    if (user) {
      return res.status(400).send(`Usuário ${email}, já existe`);
    }
    const passHash = await bcrypt.hash(password, saltRounds);
    const newUser = new ModelUser();
    newUser.name = name;
    newUser.cpf = cpf;
    newUser.email = email;
    newUser.password = passHash;
    const userSaved = await newUser.save();
    return res.json(userSaved);
  },
  async show(req, res) {
    const { login, password } = req.body;
    const user = await ModelUser.findOne({
      $or: [{ email: login }, { cpf: login }]
    });
    console.log(login);
    if (!user) return res.status(400).send(`Usuário ${login} não existe`);

    const passResult = await bcrypt.compare(password, user.password);
    if (!passResult) return res.status(400).send("Senha incorreta");

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      iat: now,
      exp: now + 60 * 60 * 24 * 365
      // exp: now + 1
    };

    return res.json({
      ...payload,
      token: jwt.encode(payload, process.env.SECRET)
    });
  },
  update(req, res) {},
  delete(req, res) {}
});
