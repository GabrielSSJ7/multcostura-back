import path from 'path'
import fs from 'fs'


module.exports = {
	store(req, res) {
		const file = req.file
		const folder = req.body.folder
		const model = req.body.model
		const id = req.body.id
		const _model = require(`../database/mongo/models/${model}`)

		const modelData = _model.findById(id)

		modelData.files = 

	}
}