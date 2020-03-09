import { schemaComposer } from 'graphql-compose';
import { FilmTC } from './Film';
import { PeopleTC } from './People';

schemaComposer.Query.addFields({
  film: FilmTC.getResolver('findById'),
  people: PeopleTC.getResolver('findById'),
  peopleByUrl: PeopleTC.getResolver('findByUrl'),
  peopleByUrls: PeopleTC.getResolver('findByUrlList'),
});

const schema = schemaComposer.buildSchema();

export default schema;
