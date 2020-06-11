import { pathToRegexp, match, parse, compile, Key } from 'path-to-regexp';

const url: string = '/user';
const keys: Key[] = [];
const a = pathToRegexp(url, keys);
console.log(keys);