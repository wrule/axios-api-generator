import { Prober } from '@wrule/prober';
import { APIMethod } from '../apiMethod';
import { IAPICase } from '../apiCase';
import { ParamsCollector } from '../paramsCollector';
import { APITemp } from '../apiTemp';
import path from 'path';

/**
 * API类，根据用例构建，代表一个聚类后的API
 */
export class API {
  /**
   * API方法
   */
  public get Method(): APIMethod {
    return this.apiCase.method;
  }

  /**
   * API请求原始路径
   */
  public get SrcPath(): string {
    return this.apiCase.path;
  }

  /**
   * 源API用例
   */
  public get Case(): IAPICase {
    return this.apiCase;
  }

  private inParams: any = {};

  /**
   * 入参数据
   */
  public get InParams(): any {
    return this.inParams;
  }

  /**
   * 出参数数据
   */
  public get OutParams(): any {
    return this.apiCase.response;
  }

  private temp: APITemp | null = null;

  /**
   * 成功匹配的模板
   */
  public get Temp(): APITemp | null {
    return this.temp;
  }

  /**
   * 是否为不依赖模板的自由接口
   */
  public get IsFree(): boolean {
    return this.temp ? false : true;
  }

  /**
   * 经过聚类后的API路径，可直接用于文件系统
   */
  public get Path(): string {
    if (this.IsFree) {
      return this.normalizationPath(this.apiCase.path);
    } else {
      return this.normalizationPath((this.Temp as APITemp).TokenNames.join('/'));
    }
  }

  /**
   * 标准化一个路径
   * @param inPath 输入路径
   * @returns 标准化之后的路径
   */
  private normalizationPath(inPath: string): string {
    return inPath.split(/\/+|\\+/).filter((sec) => sec.trim()).join('/');
  }

  /**
   * 整理入参和获取匹配模板的子过程
   */
  private initInParamsTemp(): void {
    this.inParams = {};
    this.temp = null;
    if (this.apiCase.body !== undefined) {
      this.inParams.body = this.apiCase.body;
    }
    if (Object.keys(this.apiCase.query).length > 0) {
      this.inParams.query = this.apiCase.query;
    }
    const result = this.collector.Collect(this.apiCase.path);
    if (result) {
      if (Object.keys(result.params).length > 0) {
        this.inParams.params = result.params;
      }
      this.temp = result.temp;
    }
    if (Object.keys(this.inParams).length < 1) {
      this.inParams = undefined;
    }
  }

  /**
   * 将接口代码更新到指定目录
   * @param dirPath 目录
   */
  public Update(dirPath: string): void {
    const reqPath = path.join(dirPath, this.Path, 'req');
    const rspPath = path.join(dirPath, this.Path, 'rsp');
    this.prober.Update(this.inParams, 'req', reqPath);
    this.prober.Update(this.apiCase.response, 'rsp', rspPath);
  }

  /**
   * 构造函数
   * @param apiCase API用例
   * @param collector 注入的参数采集器
   * @param prober 注入的类型推导器
   */
  public constructor(
    private apiCase: IAPICase,
    private collector: ParamsCollector,
    private prober: Prober,
  ) {
    this.initInParamsTemp();
  }
}
