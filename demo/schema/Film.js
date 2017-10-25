/* @flow */

import {
  createFindByIdResolver,
  createFindListByPageNumberResolver,
  createFindByUrlListResolver,
} from './../utils';
import composeWithRest from '../../src/index';
import { PersonTC } from './Person';
import { PlanetTC } from './Planet';
import { VehicleTC } from './Vehicle';
import { SpeciesTC } from './Species';
import { StarshipTC } from './Starship';

const responseFromRestApi = {
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl:
    "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
  characters: [
    'https://swapi.co/api/people/1/',
    'https://swapi.co/api/people/2/',
    'https://swapi.co/api/people/3/',
    'https://swapi.co/api/people/4/',
    'https://swapi.co/api/people/5/',
    'https://swapi.co/api/people/6/',
    'https://swapi.co/api/people/7/',
    'https://swapi.co/api/people/8/',
    'https://swapi.co/api/people/9/',
    'https://swapi.co/api/people/10/',
    'https://swapi.co/api/people/12/',
    'https://swapi.co/api/people/13/',
    'https://swapi.co/api/people/14/',
    'https://swapi.co/api/people/15/',
    'https://swapi.co/api/people/16/',
    'https://swapi.co/api/people/18/',
    'https://swapi.co/api/people/19/',
    'https://swapi.co/api/people/81/',
  ],
  planets: [
    'https://swapi.co/api/planets/2/',
    'https://swapi.co/api/planets/3/',
    'https://swapi.co/api/planets/1/',
  ],
  starships: [
    'https://swapi.co/api/starships/2/',
    'https://swapi.co/api/starships/3/',
    'https://swapi.co/api/starships/5/',
    'https://swapi.co/api/starships/9/',
    'https://swapi.co/api/starships/10/',
    'https://swapi.co/api/starships/11/',
    'https://swapi.co/api/starships/12/',
    'https://swapi.co/api/starships/13/',
  ],
  vehicles: [
    'https://swapi.co/api/vehicles/4/',
    'https://swapi.co/api/vehicles/6/',
    'https://swapi.co/api/vehicles/7/',
    'https://swapi.co/api/vehicles/8/',
  ],
  species: [
    'https://swapi.co/api/species/5/',
    'https://swapi.co/api/species/3/',
    'https://swapi.co/api/species/2/',
    'https://swapi.co/api/species/1/',
    'https://swapi.co/api/species/4/',
  ],
  created: '2014-12-10T14:23:31.880000Z',
  edited: '2015-04-11T09:46:52.774897Z',
  url: 'https://swapi.co/api/films/1/',
};

export const FilmTC = composeWithRest('Film', responseFromRestApi);

// //////////////
// RESOLVERS aka FieldConfig in GraphQL
// //////////////

createFindByIdResolver(FilmTC, 'films');

createFindListByPageNumberResolver(FilmTC, 'films');

createFindByUrlListResolver(FilmTC);

// //////////////
// RELATIONS
// //////////////

FilmTC.addRelation('characterObjs', {
  resolver: () => PersonTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.characters,
  },
});

FilmTC.addRelation('speciesObjs', {
  resolver: () => SpeciesTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.species,
  },
});

FilmTC.addRelation('vehicleObjs', {
  resolver: () => VehicleTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.vehicles,
  },
});

FilmTC.addRelation('starshipObjs', {
  resolver: () => StarshipTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.starships,
  },
});

FilmTC.addRelation('planetObjs', {
  resolver: () => PlanetTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.planets,
  },
});
