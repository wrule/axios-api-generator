import { pathToRegexp, match, parse, compile, Key, MatchFunction, Token } from 'path-to-regexp';

/**
 * API模板类型，主要用于匹配请求路径
 */
export class APITemp {
  private keys: Key[] = [];

  public get Keys(): Key[] {
    return this.keys;
  }

  public get KeyNames(): string[] {
    return this.keys.map((key) => key.name.toString());
  }

  private tokens: Token[] = [];

  public get Tokens(): Token[] {
    return this.tokens;
  }

  private tokenNames: string[] = [];

  public get TokenNames(): string[] {
    return this.tokenNames;
  }

  private getTokenNames(tokens: Token[]): string[] {
    const result: string[] = [];
    tokens.forEach((token) => {
      let section: string = '';
      const protName = Object.prototype.toString.call(token);
      if (protName === '[object String]') {
        section = token as string;
      } else if (protName === '[object Object]') {
        section = `_${(token as any).name}_`;
      }
      if (section) {
        result.push(section);
      }
    });
    return result;
  }

  private matchFunc: MatchFunction<object>;

  /**
   * 使用此模板匹配指定API路径
   * @param apiPath API路径
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

  private regExp: RegExp;

  public get RegExp(): RegExp {
    return this.regExp;
  }
  
  public constructor(
    private temp: string,
  ) {
    this.regExp = pathToRegexp(this.temp, this.keys);
    this.matchFunc = match(this.temp);
    this.tokens = parse(this.temp);
    this.tokenNames = this.getTokenNames(this.tokens);
  }
}
