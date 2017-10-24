/* @flow */

import { graphql, TypeComposer } from 'graphql-compose';
import OP from '../ObjectParser';

const { GraphQLFloat, GraphQLBoolean } = graphql;

describe('ObjectParser', () => {
  describe('getValueType()', () => {
    it('number', () => {
      expect(OP.getValueType(6)).toBe('Float');
      expect(OP.getValueType(77.7)).toBe('Float');
    });

    it('string', () => {
      expect(OP.getValueType('test')).toBe('String');
    });

    it('boolean', () => {
      expect(OP.getValueType(true)).toBe('Boolean');
      expect(OP.getValueType(false)).toBe('Boolean');
    });

    it('null', () => {
      expect(OP.getValueType(null)).toBe('JSON');
    });

    describe('array', () => {
      it('of number', () => {
        expect(OP.getValueType([1, 2, 3])).toEqual(['Float']);
      });

      it('of string', () => {
        expect(OP.getValueType(['a', 'b', 'c'])).toEqual(['String']);
      });

      it('of boolean', () => {
        expect(OP.getValueType([false, true])).toEqual(['Boolean']);
      });

      it('of any', () => {
        expect(OP.getValueType([null])).toEqual(['JSON']);
      });
    });

    it('process function', () => {
      const spy = jest.spyOn(OP, 'getValueTypeFromFunction');
      const valueAsFn = () => 'String';
      OP.getValueType(valueAsFn);
      expect(spy).toHaveBeenCalledWith(valueAsFn);
    });

    it('process object', () => {
      const spy = jest.spyOn(OP, 'createTC');
      const valueAsObj = { a: 123 };
      OP.getValueType(valueAsObj, {
        typeName: 'ParentTypeName',
        fieldName: 'subDocument',
      });
      expect(spy).toHaveBeenCalledWith('ParentTypeName_SubDocument', valueAsObj);
    });
  });

  describe('getValueTypeFromFunction()', () => {
    it('accept type as string', () => {
      const fn = () => 'Int';
      expect(OP.getValueTypeFromFunction(fn)).toEqual('Int');
    });

    it('accept GraphQLOutputType', () => {
      const fn = () => graphql.GraphQLBoolean;
      expect(OP.getValueTypeFromFunction(fn)).toEqual(graphql.GraphQLBoolean);

      const fn2 = () =>
        new graphql.GraphQLObjectType({
          name: 'MyType',
          fields: () => ({
            field1: { type: graphql.GraphQLFloat },
          }),
        });
      expect(OP.getValueTypeFromFunction(fn2)).toBeInstanceOf(graphql.GraphQLObjectType);
    });

    it('accept TypeComposer', () => {
      const fn = () =>
        TypeComposer.create(`
          type MyOtherType {
            f1: Int!
          }
        `);
      expect(OP.getValueTypeFromFunction(fn)).toBeInstanceOf(TypeComposer);
    });
  });

  describe('createTC()', () => {
    it('return TypeComposer', () => {
      const tc = OP.createTC('MyType', { a: 1 });
      expect(tc).toBeInstanceOf(TypeComposer);
      expect(tc.getTypeName()).toBe('MyType');
    });

    it('creates fields', () => {
      const tc = OP.createTC('MyType', { a: 1, b: true });
      expect(tc.getFieldNames()).toEqual(['a', 'b']);
      expect(tc.getFieldType('a')).toBe(GraphQLFloat);
      expect(tc.getFieldType('b')).toBe(GraphQLBoolean);
    });

    it('match snapshot', () => {
      const PeopleTC = OP.createTC('PeopleType', {
        name: 'Luke Skywalker',
        height: () => 'Int',
        mass: () => 'Int',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: {
          name: 'Tatooine',
          rotation_period: '23',
          orbital_period: '304',
          terrain: 'desert',
          surface_water: '1',
          population: () => 'Int',
        },
        films: [
          'https://swapi.co/api/films/2/',
          'https://swapi.co/api/films/6/',
          'https://swapi.co/api/films/3/',
        ],
        created: () => 'Date',
        edited: '2014-12-20T21:17:56.891000Z',
      });

      const PeopleGraphQLType = PeopleTC.getType();
      expect(PeopleGraphQLType).toMatchSnapshot();
      expect(PeopleGraphQLType.getFields()).toMatchSnapshot();

      const homeworldSubType = PeopleTC.getFieldType('homeworld');
      expect(homeworldSubType).toMatchSnapshot();
      // $FlowFixMe
      expect(homeworldSubType.getFields()).toMatchSnapshot();
    });
  });
});
