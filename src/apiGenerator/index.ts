import fs from 'fs';
import path from 'path';
import { Prober } from '@wrule/prober';
import { API } from '../api';
import { Type } from '@wrule/prober/dist/type';
import { TypeKind } from '@wrule/prober/dist/typeKind';
import { TypeInterface } from '@wrule/prober/dist/type/interface';

/**
 * API接口生成器
 */
export class APIGenerator {

  private isNeedCompile(api: API, inType: Type): boolean {
    let need = false;
    if (!api.IsFree) {
      if (inType.Kind === TypeKind.Interface) {
        const intfInType = inType as TypeInterface;
        const paramsType = intfInType.IntfMbrs.get('params');
        if (paramsType?.Kind === TypeKind.Interface) {
          const intfParamsType = paramsType as TypeInterface;
          if (intfParamsType.IntfMbrs.size > 0) {
            need = true;
          }
        }
      }
    }
    return need;
  }


  private getAPIIndexCode(
    api: API,
    inType: Type,
    outType: Type,
  ): string {
    let needCompile = this.isNeedCompile(api, inType);
    return `
import axios from 'axios';
${needCompile ? `import { compile } from 'path-to-regexp';` : ''}
${inType.Kind === TypeKind.Interface ? `import { ${inType.TypeDesc} } from './req';` : ''}
${inType.DepIntfTypes.map((intfType) => `import { ${intfType.TypeDesc} } from './req/${intfType.IntfFullName}';`).join('\r\n')}
${outType.Kind === TypeKind.Interface ? `import { ${outType.TypeDesc} } from './req';` : ''}
${outType.DepIntfTypes.map((intfType) => `import { ${intfType.TypeDesc} } from './req/${intfType.IntfFullName}';`).join('\r\n')}

${needCompile ? `const compileFunc = compile('${api.Temp?.Temp}');` : ''}

export const someApi = async (${''}): Promise<${outType.TypeDesc}> => {
}
`;
  }

  private writeAPIIndex(
    dirPath: string,
    api: API,
    inType: Type,
    outType: Type,
  ): void {
    fs.writeFileSync(
      path.join(dirPath, api.Path),
      this.getAPIIndexCode(api, inType, outType),
      'utf8',
    );
  }

  /**
   * 更新API的参数到指定路径
   * @param api API
   * @param dirPath 路径
   * @param params 参数
   * @param desc 参数描述
   * @returns 更新后的参数类型
   */
  private updateParams(
    api: API,
    dirPath: string,
    params: any,
    desc: string,
  ): Type {
    return this.prober.Update(
      params,
      desc,
      path.join(dirPath, api.Path, desc),
    );
  }

  /**
   * 更新API到指定路径
   * @param api API
   * @param dirPath 路径
   */
  public Update(
    api: API,
    dirPath: string,
  ): void {
    const inType = this.updateParams(api, dirPath, api.InParams, 'req');
    const outType = this.updateParams(api, dirPath, api.OutParams, 'rsp');
  }

  public constructor(
    private prober: Prober,
  ) {}
}
