import path from 'path';
import { ParamsCollector } from './paramsCollector';
import { IAPICase } from './apiCase';
import { APIMethod } from './apiMethod';
import { API } from './api';
import { Prober } from '@wrule/prober';

const collector = new ParamsCollector([
  '/api/user/new',
  '/api/user/delete',
  '/api/user/:id',
  '/api/user/:id/update',
]);

const apiCase: IAPICase = {
  path: '/api/user/2334/update',
  method: APIMethod.POST,
  body: {
    name: 'gushi',
  },
  query: {
    onlyMe: true,
  },
  response: {
    success: true,
    object: {
      id: '28383276',
      name: 'jimao',
      nums: [1, 2, 3, 4, null],
    },
    message: '操作成功',
  },
};

const prober = new Prober();
const api = new API(apiCase, collector, prober);

console.log(api.Path);
api.Update(path.join(__dirname, '..', 'src', 'output'));
