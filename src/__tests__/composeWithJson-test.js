/* @flow */

import fetch from 'node-fetch';
import { graphql } from 'graphql-compose';
import schema from '../__fixtures__/Schema';
import { PeopleTC } from '../__fixtures__/People';
import { composeWithJson } from '../index';

const { GraphQLSchema, GraphQLObjectType } = graphql;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('composeWithJson', () => {
  it('request film by id', async () => {
    const res = await graphql.graphql(
      schema,
      `{
        film(id: 1) {
          title
          episode_id
        }
      }`
    );
    expect(res).toEqual({
      data: { film: { title: 'A New Hope', episode_id: 4 } },
    });
  });

  it('request people with films', async () => {
    const res = await graphql.graphql(
      schema,
      `{
        people(id: 1) {
          name
          films
          filmObjs {
            title
          }
        }
      }`
    );
    expect(res).toEqual({
      data: {
        people: {
          name: 'Luke Skywalker',
          filmObjs: [
            { title: 'The Empire Strikes Back' },
            { title: 'Revenge of the Sith' },
            { title: 'Return of the Jedi' },
            { title: 'A New Hope' },
            { title: 'The Force Awakens' },
          ],
          films: [
            'https://swapi.co/api/films/2/',
            'https://swapi.co/api/films/6/',
            'https://swapi.co/api/films/3/',
            'https://swapi.co/api/films/1/',
            'https://swapi.co/api/films/7/',
          ],
        },
      },
    });
  });

  it('allow set field config via function', async () => {
    const restApiResponse = {
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war of ... freedom to the galaxy....',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      // planets: [
      //   'https://swapi.co/api/planets/2/',
      //   'https://swapi.co/api/planets/3/',
      //   'https://swapi.co/api/planets/1/'
      // ],
      planets: () => ({
        type: 'Int',
        resolve: source => source.planets.length,
      }),
      // characters: [
      //   'https://swapi.co/api/people/1/',
      //   'https://swapi.co/api/people/2/',
      //   'https://swapi.co/api/people/3/',
      // ],
      characters: () =>
        PeopleTC.getResolver('findByUrlList')
          .wrapResolve(next => rp => {
            const characterUrls = rp.source.characters;
            rp.args.urls = characterUrls; // eslint-disable-line
            return next(rp);
          })
          .removeArg('urls'),
    };

    const FilmTC = composeWithJson('FilmCustom', restApiResponse);

    const schema1 = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          film: {
            type: FilmTC.getType(),
            resolve: () => {
              return fetch(`https://swapi.co/api/films/1`).then(r => r.json());
            },
          },
        },
      }),
    });

    const res = await graphql.graphql(
      schema1,
      `{
        film {
          title
          planets
          characters {
            name
          }
        }
      }`
    );

    expect(res).toEqual({
      data: {
        film: {
          title: 'A New Hope',
          planets: 3,
          characters: [
            { name: 'Luke Skywalker' },
            { name: 'C-3PO' },
            { name: 'R2-D2' },
            { name: 'Darth Vader' },
            { name: 'Leia Organa' },
            { name: 'Owen Lars' },
            { name: 'Beru Whitesun lars' },
            { name: 'R5-D4' },
            { name: 'Biggs Darklighter' },
            { name: 'Obi-Wan Kenobi' },
            { name: 'Wilhuff Tarkin' },
            { name: 'Chewbacca' },
            { name: 'Han Solo' },
            { name: 'Greedo' },
            { name: 'Jabba Desilijic Tiure' },
            { name: 'Wedge Antilles' },
            { name: 'Jek Tono Porkins' },
            { name: 'Raymus Antilles' },
          ],
        },
      },
    });
  });

  it('check shallow objects', async () => {
    const restApiResponse = {
      title: 'A New Hope',
      producer: {
        name: 'Gary Kurtz, Rick McCallum',
      },
    };

    const FilmTC = composeWithJson('FilmCustom', restApiResponse);

    expect(FilmTC.getFieldTC('producer').getTypeName()).toBe('FilmCustom_Producer');
    expect(FilmTC.getFieldTC('producer').getFieldNames()).toEqual(['name']);
    expect(
      FilmTC.getFieldTC('producer')
        .getFieldType('name')
        .toString()
    ).toBe('String');

    const schema1 = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          film: {
            type: FilmTC.getType(),
            resolve: () => {
              return restApiResponse;
            },
          },
        },
      }),
    });

    const res = await graphql.graphql(
      schema1,
      `{
        film {
          title
          producer {
            name
          }
        }
      }`
    );

    expect(res).toEqual({
      data: {
        film: {
          title: 'A New Hope',
          producer: {
            name: 'Gary Kurtz, Rick McCallum',
          },
        },
      },
    });
  });

  it('check array of swallow objects', async () => {
    const restApiResponse = {
      name: 'Luke Skywalker',
      limbs: [
        { kind: 'arm', position: 'left', length: 76 },
        { kind: 'arm', position: 'left', length: 76 },
        { kind: 'leg', position: 'left', length: 81 },
        { kind: 'leg', position: 'right', length: 82 },
      ],
    };

    const PersonTC = composeWithJson('PersonCustom', restApiResponse);
    const schema1 = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          person: {
            type: PersonTC.getType(),
            resolve: () => {
              return restApiResponse;
            },
          },
        },
      }),
    });

    const res = await graphql.graphql(
      schema1,
      `{
        person {
          name
          limbs {
            length
          }
        }
      }`
    );

    expect(res).toEqual({
      data: {
        person: {
          name: 'Luke Skywalker',
          limbs: [{ length: 76 }, { length: 76 }, { length: 81 }, { length: 82 }],
        },
      },
    });
  });
});
