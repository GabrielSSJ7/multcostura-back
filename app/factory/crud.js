export default function crudFactory(model) {
  function store(data, cb) {
    model.create(data, cb);
  }

  function update(data, document, cb) {
    model.updateOne(document, data, cb);
  }

  function index(filters, cb) {
    model.find(filters, cb);
  }

  return {
    store,
    update,
    index,
  };
}
