import { APITemp } from './apiTemp';
import { ParamsCollector } from './paramsCollector';
import { pathToRegexp, match, parse, compile, Key, MatchFunction } from 'path-to-regexp';
import { IAPICase } from './apiCase';
import { APIMethod } from './apiMethod';
import { API } from './api';

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
    },
    message: '操作成功',
  },
};

const api = new API(apiCase, collector);

console.log(api.Path);

