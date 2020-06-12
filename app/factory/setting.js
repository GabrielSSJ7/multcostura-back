import ModelFactory from '../database/mongo/models/settings'
import crudFactory from './crud'

export default function settingsFactory () {
  const crud = crudFactory(ModelFactory)

  function insert (data, cb) {
    crud.store(data, cb)
  }

  function update (data, document,cb) {
    crud.update(data, document, cb)
  }

  function list (filter, cb) {
    crud.index(filter, cb)
  }

  return {
    insert,
    update,
    list
  }
}