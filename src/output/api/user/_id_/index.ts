import axios from 'axios';
import { compile } from 'path-to-regexp';
import { IReq_294C90D5 } from './req';
import { IRsp_4648815F } from './rsp';

const compileFunc = compile('');

export const someApi = async (req: IReq_294C90D5): Promise<IRsp_4648815F> => {
  let reqPath = '';
  if (req.params) {
    reqPath = compileFunc(req.params);
  }
  return (await axios.post(reqPath, req.body, { params: req.query })) as IRsp_4648815F;
  return (await axios.put(reqPath, req.body, { params: req.query, data: req.body }) ) as IRsp_4648815F;
  return (await axios.patch(reqPath, req.body, { params: req.query, data: req.body }) ) as IRsp_4648815F;
  return (await axios.delete(reqPath, { params: req.query, data: req.body }) ) as IRsp_4648815F;

  return (await axios.get(reqPath, { params: req.query, data: req.body }) ) as IRsp_4648815F;
  return (await axios.head(reqPath, { params: req.query, data: req.body }) ) as IRsp_4648815F;
  return (await axios.options(reqPath, { params: req.query, data: req.body }) ) as IRsp_4648815F;
}
