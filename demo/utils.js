/* @flow */

import type { TypeComposer } from 'graphql-compose';
import fetch from 'node-fetch';

export function createFindByIdResolver(tc: TypeComposer, urlAddr: string): void {
  tc.addResolver({
    name: 'findById',
    type: tc,
    args: {
      id: 'Int!',
    },
    resolve: async rp => {
      const res = await fetch(`https://swapi.co/api/${urlAddr}/${rp.args.id}/`);
      const data = await res.json();
      return data;
    },
  });
}

export function createFindListByPageNumberResolver(tc: TypeComposer, urlAddr: string): void {
  tc.addResolver({
    name: 'findListByPageNumber',
    type: [tc],
    args: {
      page: { type: 'Int', defaultValue: 1 },
    },
    resolve: async rp => {
      const res = await fetch(`https://swapi.co/api/${urlAddr}/?page=${rp.args.page}`);
      const data = await res.json();
      return data.results;
    },
  });
}

export function createFindByUrlListResolver(tc: TypeComposer): void {
  tc.addResolver({
    name: 'findByUrlList',
    type: [tc],
    args: {
      urls: '[String]!',
    },
    resolve: rp => {
      return rp.args.urls.map(async url => {
        const res = await fetch(url);
        const data = await res.json();
        return data;
      });
    },
  });
}
