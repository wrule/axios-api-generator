import { Prober } from '@wrule/prober';
import { APIMethod } from '../apiMethod';
import { Type } from '@wrule/prober/dist/type';
import { IAPICase } from '../apiCase';
import { ParamsCollector } from '../paramsCollector';
import { APITemp } from '../apiTemp';
import path from 'path';

export class API {
  /**
   * API方法
   */
  public get Method(): APIMethod {
    return this.apiCase.method;
  }

  /**
   * 源API用例
   */
  public get Case(): IAPICase {
    return this.apiCase;
  }

  private prober: Prober;

  private inParams: any = {};

  /**
   * 整理后的入参数据
   */
  public get InParams(): any {
    return this.inParams;
  }

  private inParamsType: Type;

  /**
   * 入参类型
   */
  public get InParamsType(): Type {
    return this.inParamsType;
  }

  private temp: APITemp | null = null;

  /**
   * 成功匹配的模板
   */
  public get Temp(): APITemp | null {
    return this.temp;
  }

  private outParamsType: Type;

  /**
   * 出参类型
   */
  public get OutParamsType(): Type {
    return this.outParamsType;
  }

  /**
   * 经过聚类后的API路径，可直接用于文件系统
   */
  public get Path(): string {
    if (this.Temp) {
      return this.normalizationPath(this.Temp.TokenNames.join('/'));
    } else {
      return this.normalizationPath(this.apiCase.path);
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

  public UpdateToDir(dirPath: string): void {
    const reqPath = path.join(dirPath, this.Path, 'req');
    const rspPath = path.join(dirPath, this.Path, 'rsp');
    console.log(reqPath);
    this.prober.Update(this.inParams, 'req', reqPath);
    this.prober.Update(this.apiCase.response, 'rsp', rspPath);
  }

  /**
   * 构造函数
   * @param apiCase API用例
   * @param collector 注入的参数采集器
   */
  public constructor(
    private apiCase: IAPICase,
    private collector: ParamsCollector,
  ) {
    this.initInParamsTemp();
    this.prober = new Prober();
    this.inParamsType = this.prober.Do(this.inParams, 'req');
    this.outParamsType = this.prober.Do(this.apiCase.response, 'rsp');
  }
}
