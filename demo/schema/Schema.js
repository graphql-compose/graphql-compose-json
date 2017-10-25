/* @flow */

import { GQC } from 'graphql-compose';
import { FilmTC } from './Film';
import { PersonTC } from './Person';
import { PlanetTC } from './Planet';
import { VehicleTC } from './Vehicle';
import { SpeciesTC } from './Species';
import { StarshipTC } from './Starship';

GQC.rootQuery().addFields({
  film: FilmTC.getResolver('findById'),
  person: PersonTC.getResolver('findById'),
  planet: PlanetTC.getResolver('findById'),
  speciesOne: SpeciesTC.getResolver('findById'),
  vehicle: VehicleTC.getResolver('findById'),
  starship: StarshipTC.getResolver('findById'),
  people: PersonTC.getResolver('findListByPageNumber'),
  planets: PlanetTC.getResolver('findListByPageNumber'),
  speciesMany: SpeciesTC.getResolver('findListByPageNumber'),
  vehicles: VehicleTC.getResolver('findListByPageNumber'),
  starships: StarshipTC.getResolver('findListByPageNumber'),
  films: FilmTC.getResolver('findListByPageNumber'),
});

const schema = GQC.buildSchema();

export default schema;
