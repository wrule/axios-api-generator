import { APITemp } from '../apiTemp';

/**
 * 参数采集器
 * 用于根据模板列表采集隐藏在请求路径中的参数
 */
export class ParamsCollector {
  private temps: APITemp[];

  /**
   * 根据模板采集请求路径中的参数
   * @param reqPath 请求路径
   * @returns 匹配成功返回参数与对应模板，失败返回null
   */
  public Collect(reqPath: string): {
    params: object,
    temp: APITemp,
  } | null {
    for (let i = 0; i < this.temps.length; ++i) {
      const curTemp = this.temps[i];
      const result = curTemp.Match(reqPath);
      if (result) {
        return {
          params: result,
          temp: curTemp,
        };
      }
    }
    return null;
  }

  /**
   * 构造函数
   * @param tempStrs 模板字符串列表
   */
  public constructor(
    tempStrs: string[],
  ) {
    this.temps = tempStrs.map((tempStr) => new APITemp(tempStr));
  }
}
