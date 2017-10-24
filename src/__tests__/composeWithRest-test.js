import { graphql } from 'graphql-compose';
import schema from '../__fixtures__/Schema';

describe('composeWithRest', () => {
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
    expect(res).toEqual({ data: { film: { title: 'A New Hope', episode_id: 4 } } });
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
});
