import { APIMethod } from '../apiMethod';

/**
 * API用例，用例为一次完整的API请求记录下来的有用的信息
 */
export interface IAPICase {
  /**
   * 实际请求路径
   */
  path: string,
  /**
   * http请求方法
   */
  method: APIMethod,
  /**
   * request body数据
   */
  body: any,
  /**
   * request query数据
   */
  query: object,
  /**
   * response数据
   */
  response: any,
}
