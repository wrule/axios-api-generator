import { Prober } from '@wrule/prober';
import { APIType } from '../apiType';
import { Type } from '@wrule/prober/dist/type';
import { TypeInterface } from '@wrule/prober/dist/type/interface';

export default abstract class API {
  public get APIType(): APIType {
    return this.apiType;
  }

  public get SrcUrl(): string {
    return this.url;
  }

  public get SrcRsp(): any {
    return this.rsp;
  }

  public get Url(): string {
    return this.url;
  }

  protected get UrlSecs(): string[] {
    return this.Url.split(/\/+|\\+/);
  }

  public get InType(): Type {
    return new TypeInterface();
  }

  public get OutType(): Type {
    return new TypeInterface();
  }

  /**
   * 适用于文件系统的文件夹路径
   */
  public get DirPath(): string {
    return this.UrlSecs.join('/');
  }

  public constructor(
    private apiType: APIType,
    private url: string,
    private rsp: any,
  ) {}
}
