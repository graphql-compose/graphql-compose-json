/* @flow */

import { GQC } from 'graphql-compose';
import { FilmTC } from './Film';
import { PeopleTC } from './People';

GQC.rootQuery().addFields({
  film: FilmTC.getResolver('findById'),
  people: PeopleTC.getResolver('findById'),
  peopleByUrl: PeopleTC.getResolver('findByUrl'),
  peopleByUrls: PeopleTC.getResolver('findByUrlList'),
});

const schema = GQC.buildSchema();

export default schema;
