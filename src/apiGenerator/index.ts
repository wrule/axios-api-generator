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

  public Update(
    api: API,
    dirPath: string,
  ): void {
    const inType = this.prober.Update(
      api.InParams,
      'req',
      path.join(dirPath, api.Path, 'req'),
    );
    const outType = this.prober.Update(
      api.OutParams,
      'rsp',
      path.join(dirPath, api.Path, 'req'),
    );
    this.writeAPIIndex(dirPath, api, inType, outType);
  }

  public constructor(
    private prober: Prober,
  ) {}
}
