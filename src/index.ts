import { APITemp } from './apiTemp';
import { ParamsCollector } from './paramsCollector';

const collector = new ParamsCollector([
  '/users/:id',
  '/users',
  '/stu/:id/update/:zone?'
]);

const result = collector.Collect('/stu/122/update');

console.log(result);