/* @flow */

// import fetch from 'node-fetch';
import composeWithRest from '../../src/index';
import {
  createFindByIdResolver,
  createFindListByPageNumberResolver,
  createFindByUrlListResolver,
} from '../utils';
import { FilmTC } from './Film';
import { PlanetTC } from './Planet';
import { VehicleTC } from './Vehicle';
import { SpeciesTC } from './Species';
import { StarshipTC } from './Starship';

const responseFromRestApi = {
  name: 'Anakin Skywalker',
  height: '188',
  mass: '84',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '41.9BBY',
  gender: 'male',
  homeworld: 'https://swapi.co/api/planets/1/',
  films: [
    'https://swapi.co/api/films/5/',
    'https://swapi.co/api/films/4/',
    'https://swapi.co/api/films/6/',
  ],
  species: ['https://swapi.co/api/species/1/'],
  vehicles: ['https://swapi.co/api/vehicles/44/', 'https://swapi.co/api/vehicles/46/'],
  starships: [
    'https://swapi.co/api/starships/59/',
    'https://swapi.co/api/starships/65/',
    'https://swapi.co/api/starships/39/',
  ],
  created: '2014-12-10T16:20:44.310000Z',
  edited: '2014-12-20T21:17:50.327000Z',
  url: 'https://swapi.co/api/people/11/',
};

export const PersonTC = composeWithRest('Person', responseFromRestApi);

createFindByIdResolver(PersonTC, 'people');

createFindListByPageNumberResolver(PersonTC, 'people');

createFindByUrlListResolver(PersonTC);

PersonTC.addRelation('filmObjs', {
  resolver: () => FilmTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.films,
  },
});

PersonTC.addRelation('homeworldObj', {
  resolver: () => PlanetTC.getResolver('findByUrl'),
  prepareArgs: {
    urls: source => source.homeworld,
  },
});

PersonTC.addRelation('speciesObjs', {
  resolver: () => SpeciesTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.species,
  },
});

PersonTC.addRelation('vehicleObjs', {
  resolver: () => VehicleTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.vehicles,
  },
});

PersonTC.addRelation('starshipObjs', {
  resolver: () => StarshipTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.starships,
  },
});
