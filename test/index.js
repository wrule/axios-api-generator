const path = require('path');
const { APIGenerator, API, ParamsCollector, Prober, APIMethod } = require('../dist/index');

const collector = new ParamsCollector([
  '/api/user/new',
  '/api/user/:id/delete',
  '/api/user/:id/update',
  '/api/user/:id',
]);

const api = new API({
  method: APIMethod.PATCH,
  path: '/api/user/new',
  response: '你好，世界',
}, collector);

const prober = new Prober();

const gen = new APIGenerator(prober);

gen.Update(api, path.join(__dirname, '..', 'src', 'output'));

console.log(api.Path);
console.log(api.InParams);
console.log(api.OutParams);
