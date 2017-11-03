/* @flow */

import fetch from 'node-fetch';
import { composeWithJson } from '../index';
import { FilmTC } from './Film';

const restApiResponse = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  films: [
    'https://swapi.co/api/films/2/',
    'https://swapi.co/api/films/6/',
    'https://swapi.co/api/films/3/',
  ],
};

export const PeopleTC = composeWithJson('People', restApiResponse);

// //////////////
// RESOLVERS aka FieldConfig in GraphQL
// //////////////

PeopleTC.addResolver({
  name: 'findById',
  type: PeopleTC,
  args: {
    id: 'Int!',
  },
  resolve: rp => {
    return fetch(`https://swapi.co/api/people/${rp.args.id}/`).then(r => r.json());
  },
});

PeopleTC.addResolver({
  name: 'findByUrl',
  type: PeopleTC,
  args: {
    url: 'String!',
  },
  resolve: rp => fetch(rp.args.url).then(r => r.json()),
});

PeopleTC.addResolver({
  name: 'findByUrlList',
  type: [PeopleTC],
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

PeopleTC.addRelation('filmObjs', {
  resolver: () => FilmTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.films,
  },
});
