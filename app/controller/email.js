import { envConfig, sendMail } from '../utils/email'
import path from 'path'

module.exports = {
	store(req, res) {
		const { nome, endereco, bairro, cidade, uf, tel, mensagem } = req.body;

		const smtp = envConfig(path.join(__dirname, '../templates/email/'), path.join(__dirname, '../templates/email/'))
		
		sendMail({ 
			name: "pagina_contato", 
			context: { nome, endereco, bairro, cidade, uf, tel, mensagem } }, 
			{ to: process.env.EMAIL_TO, from: process.env.EMAIL_FROM, subject: process.env.EMAIL_SUBJECT }, 
			smtp
		)
			.then(ress => {
				return res.sendStatus(200)
			})
			.catch(err => {
				console.log(err)
				return res.status(400).json(err)
			});
	}
}