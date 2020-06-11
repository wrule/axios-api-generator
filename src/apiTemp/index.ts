import { pathToRegexp, match, parse, compile, Key, MatchFunction } from 'path-to-regexp';

export class APITemp {
  private regExp: RegExp;
  private keys: Key[] = [];
  private matchFunc: MatchFunction<object>;

  public get Keys(): Key[] {
    return this.keys;
  }

  public get KeyNames(): string[] {
    return this.keys.map((key) => key.name.toString());
  }

  /**
   * 使用此模板匹配指定api路径
   * @param apiPath api路径
   * @returns 匹配成功返回路径参数，失败返回null
   */
  public Match(apiPath: string): object | null {
    const result = this.matchFunc(apiPath);
    if (result) {
      return { ...result.params };
    } else {
      return null;
    }
  }
  
  public constructor(
    private temp: string,
  ) {
    this.regExp = pathToRegexp(this.temp, this.keys);
    this.matchFunc = match(this.temp);
  }
}
