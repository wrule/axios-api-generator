import fs from 'fs';
import path from 'path';
import { Prober } from '@wrule/prober';
import { API } from '../api';
import { APIMethod } from '../apiMethod';
import { Type } from '@wrule/prober/dist/type';
import { TypeKind } from '@wrule/prober/dist/typeKind';
import { TypeInterface } from '@wrule/prober/dist/type/interface';

/**
 * API接口生成器
 */
export class APIGenerator {
  /**
   * 判断API是否需要运行时路径编译
   * @param api API
   * @param inType 入参类型
   * @returns 逻辑值，是否需要
   */
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

  /**
   * 根据API方法类型和入参类型获取不同的参数列表代码
   * @param api API
   * @returns 参数列表代码
   */
  private reqArgs(api: API, inType: Type): string {
    if (inType.Kind === TypeKind.Interface) {
      if (
        api.Method === APIMethod.POST ||
        api.Method === APIMethod.PUT ||
        api.Method === APIMethod.PATCH
      ) {
        return `(reqPath, (req as any).body, { params: (req as any).query })`;
      } else {
        return `(reqPath, { params: (req as any).query, data: (req as any).body })`;
      }
    } else {
      return '(reqPath)';
    }
  }

  /**
   * 获取API定义代码
   * @param api API
   * @param inType 入参类型
   * @param outType 出参类型
   * @returns API接口定义代码
   */
  private getAPIIndexCode(
    api: API,
    inType: Type,
    outType: Type,
  ): string {
    let needCompile = this.isNeedCompile(api, inType);
    const imports: string[] = [];
    imports.push(...(true ? [this.httpCode] : []));
    imports.push(...(needCompile ? [`import { compile } from 'path-to-regexp';`] : []));
    imports.push(...(inType.Kind === TypeKind.Interface ? [`import { ${inType.TypeDesc} } from './req';`] : []));
    imports.push(...(inType.Kind !== TypeKind.Interface ? inType.DepIntfTypes.map((intfType) => `import { ${intfType.TypeDesc} } from './req/${intfType.IntfFullName}';`) : []));
    imports.push(...(outType.Kind === TypeKind.Interface ? [`import { ${outType.TypeDesc} } from './rsp';`] : []));
    imports.push(...(outType.Kind !== TypeKind.Interface ? outType.DepIntfTypes.map((intfType) => `import { ${intfType.TypeDesc} } from './rsp/${intfType.IntfFullName}';`) : []));
    imports.push(...(needCompile ? [`const compileFunc = compile('${api.Temp?.TempStr}');`] : []));

    return `
${imports.join('\r\n')}

export default async function api(${inType.Kind === TypeKind.Interface ? `req: ${inType.TypeDesc}` : ''}): Promise<${outType.TypeDesc}> {
  const reqPath = ${needCompile ? 'compileFunc(req.params)' : `'${api.SrcPath}'`};
  return (await http.${api.Method}${this.reqArgs(api, inType)}) as ${outType.TypeDesc};
}`.trim() + '\r\n';
  }

  /**
   * 向指定路径写入API定义代码
   * @param dirPath 路径
   * @param api API
   * @param inType 入参类型
   * @param outType 出参类型
   */
  private writeAPIIndex(
    dirPath: string,
    api: API,
    inType: Type,
    outType: Type,
  ): void {
    const dstPath = path.join(dirPath, api.Path);
    if (!fs.existsSync(dstPath)) {
      fs.mkdirSync(dstPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dstPath, 'index.ts'),
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
    this.writeAPIIndex(dirPath, api, inType, outType);
  }

  /**
   * 构造函数
   * @param prober 注入的类型探测器对象
   */
  public constructor(
    private httpCode: string,
    private prober: Prober,
  ) {}
}
