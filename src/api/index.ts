import { Prober } from '@wrule/prober';
import { APIType } from '../apiType';

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

  /**
   * 适用于文件系统的文件夹路径
   */
  public get DirPath(): string {
    return this.Url.split(/\/+|\\+/).join('/');
  }

  public constructor(
    private apiType: APIType,
    private url: string,
    private rsp: any,
  ) {}
}
