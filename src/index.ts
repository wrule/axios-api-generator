// import axios from 'axios';

interface params {
  params?: {
    a: string,
  },
  query?: {
    b: string,
  },
  body?: {
    c: number,
  },
}

const someApi = (p: params) => {

}

someApi({
  params: {
    a: "1232"
  },
})

// axios.post('', {}, { params: {} });

import { pathToRegexp, match, parse, compile, Key } from 'path-to-regexp';

const url: string = '/user/:id/account/:act';
const a = match(url);
console.log(a('/user/123/account/222'));

const b = parse(url);
console.log(b);

const c = compile(url);
const d = c({
  id: '333',
  act: '3233',
});
console.log(d);

console.log(a('/user/123/account/222'));
const k = a('/user/12神神道道3/account/222');
console.log((k as any).params.id);
