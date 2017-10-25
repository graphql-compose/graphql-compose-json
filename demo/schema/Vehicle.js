/* @flow */

import {
  createFindByIdResolver,
  createFindListByPageNumberResolver,
  createFindByUrlListResolver,
} from './../utils';
import composeWithRest from '../../src/index';
import { PersonTC } from './Person';
import { FilmTC } from './Film';

const responseFromRestApi = {
  name: 'XJ-6 airspeeder',
  model: 'XJ-6 airspeeder',
  manufacturer: 'Narglatch AirTech prefabricated kit',
  cost_in_credits: 'unknown',
  length: '6.23',
  max_atmosphering_speed: '720',
  crew: '1',
  passengers: '1',
  cargo_capacity: 'unknown',
  consumables: 'unknown',
  vehicle_class: 'airspeeder',
  pilots: ['https://swapi.co/api/people/11/'],
  films: ['https://swapi.co/api/films/5/'],
  created: '2014-12-20T17:19:19.991000Z',
  edited: '2014-12-22T18:21:16.150194Z',
  url: 'https://swapi.co/api/vehicles/46/',
};

export const VehicleTC = composeWithRest('Vehicle', responseFromRestApi);

// //////////////
// RESOLVERS aka FieldConfig in GraphQL
// //////////////

createFindByIdResolver(VehicleTC, 'vehicles');

createFindListByPageNumberResolver(VehicleTC, 'vehicles');

createFindByUrlListResolver(VehicleTC);

// //////////////
// RELATIONS
// //////////////

VehicleTC.addRelation('pilotObjs', {
  resolver: () => PersonTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.pilots,
  },
});

VehicleTC.addRelation('filmObjs', {
  resolver: () => FilmTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.films,
  },
});
