import { Prober } from '@wrule/prober';
import { APIMethod } from '../apiMethod';
import { Type } from '@wrule/prober/dist/type';
import { TypeInterface } from '@wrule/prober/dist/type/interface';
import { IAPICase } from '../apiCase';

export default abstract class API {
  public get Method(): APIMethod {
    return this.apiCase.method;
  }

  public get InType(): Type {
    return new TypeInterface();
  }

  private outType: Type;
  public get OutType(): Type {
    return this.outType;
  }

  /**
   * 适用于文件系统的文件夹路径
   */
  // public get DirPath(): string {
  //   return this.UrlSecs.join('/');
  // }

  public get Case(): IAPICase {
    return this.apiCase;
  }

  private prober: Prober;


  private get InData(): any {
    const result: any = {};
    if (this.apiCase.body) {
      result.body = this.apiCase.body;
    }
    if (Object.keys(this.apiCase.query).length > 0) {
      result.query = this.apiCase.query;
    }
    
    return result;
  }

  public constructor(
    private apiCase: IAPICase,
  ) {
    this.prober = new Prober();
    this.outType = this.prober.Do(this.apiCase.response, 'rsp');

  }
}
