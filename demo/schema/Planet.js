/* @flow */

import fetch from 'node-fetch';
import {
  createFindByIdResolver,
  createFindListByPageNumberResolver,
  createFindByUrlListResolver,
} from './../utils';
import composeWithRest from '../../src/index';
import { PersonTC } from './Person';
import { FilmTC } from './Film';

const responseFromRestApi = {
  name: 'Alderaan',
  rotation_period: '24',
  orbital_period: '364',
  diameter: '12500',
  climate: 'temperate',
  gravity: '1 standard',
  terrain: 'grasslands, mountains',
  surface_water: '40',
  population: '2000000000',
  residents: [
    'https://swapi.co/api/people/5/',
    'https://swapi.co/api/people/68/',
    'https://swapi.co/api/people/81/',
  ],
  films: ['https://swapi.co/api/films/6/', 'https://swapi.co/api/films/1/'],
  created: '2014-12-10T11:35:48.479000Z',
  edited: '2014-12-20T20:58:18.420000Z',
  url: 'https://swapi.co/api/planets/2/',
};

export const PlanetTC = composeWithRest('Planet', responseFromRestApi);

// //////////////
// RESOLVERS aka FieldConfig in GraphQL
// //////////////

createFindByIdResolver(PlanetTC, 'planets');

createFindListByPageNumberResolver(PlanetTC, 'planets');

createFindByUrlListResolver(PlanetTC);

PlanetTC.addResolver({
  name: 'findByUrl',
  type: PlanetTC,
  args: {
    url: 'String!',
  },
  resolve: rp => fetch(rp.args.url).then(r => r.json()),
});

// //////////////
// RELATIONS
// //////////////

PlanetTC.addRelation('residentObjs', {
  resolver: () => PersonTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.residents,
  },
});

PlanetTC.addRelation('filmObjs', {
  resolver: () => FilmTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.films,
  },
});
