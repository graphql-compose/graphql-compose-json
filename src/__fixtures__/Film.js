/* @flow */

import fetch from 'node-fetch';
import { composeWithJson } from '../index';
import { PeopleTC } from './People';

const restApiResponse = {
  title: 'The Empire Strikes Back',
  episode_id: 5,
  opening_crawl: 'It is a dark time for ...',
  director: 'Irvin Kershner',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1980-05-17',
  characters: [
    'https://swapi.co/api/people/1/',
    'https://swapi.co/api/people/2/',
    'https://swapi.co/api/people/3/',
  ],
};

export const FilmTC = composeWithJson('Film', restApiResponse);

// //////////////
// RESOLVERS aka FieldConfig in GraphQL
// //////////////

FilmTC.addResolver({
  name: 'findById',
  type: FilmTC,
  args: {
    id: 'Int!',
  },
  resolve: rp => {
    return fetch(`https://swapi.co/api/films/${rp.args.id}/`).then(r => r.json());
  },
});

FilmTC.addResolver({
  name: 'findByUrl',
  type: FilmTC,
  args: {
    url: 'String!',
  },
  resolve: rp => fetch(rp.args.url).then(r => r.json()),
});

FilmTC.addResolver({
  name: 'findByUrlList',
  type: [FilmTC],
  args: {
    urls: '[String]!',
  },
  resolve: rp => {
    return Promise.all(rp.args.urls.map(url => fetch(url).then(r => r.json())));
  },
});

// //////////////
// RELATIONS
// //////////////

FilmTC.addRelation('characters', {
  resolver: () => PeopleTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.characters,
  },
});

FilmTC.addFields({
  currentTime: { type: 'String', resolve: () => Date.now() },
});
