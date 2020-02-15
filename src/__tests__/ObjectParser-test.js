/* @flow */

import { graphql, ObjectTypeComposer } from 'graphql-compose';
import OP from '../ObjectParser';

const { GraphQLFloat, GraphQLBoolean } = graphql;

describe('ObjectParser', () => {
  describe('getFieldConfig()', () => {
    it('number', () => {
      expect(OP.getFieldConfig(6)).toBe('Float');
      expect(OP.getFieldConfig(77.7)).toBe('Float');
    });

    it('string', () => {
      expect(OP.getFieldConfig('test')).toBe('String');
    });

    it('boolean', () => {
      expect(OP.getFieldConfig(true)).toBe('Boolean');
      expect(OP.getFieldConfig(false)).toBe('Boolean');
    });

    it('null', () => {
      expect(OP.getFieldConfig(null)).toBe('JSON');
    });

    describe('array', () => {
      it('of number', () => {
        expect(OP.getFieldConfig([1, 2, 3])).toEqual(['Float']);
      });

      it('of string', () => {
        expect(OP.getFieldConfig(['a', 'b', 'c'])).toEqual(['String']);
      });

      it('of boolean', () => {
        expect(OP.getFieldConfig([false, true])).toEqual(['Boolean']);
      });

      it('of object', () => {
        const spy = jest.spyOn(OP, 'createTC');
        const valueAsArrayOfObjects = [{ a: 123 }, { a: 456 }];
        OP.getFieldConfig(valueAsArrayOfObjects, {
          typeName: 'ParentTypeName',
          fieldName: 'subDocument',
        });
        expect(spy).toHaveBeenCalledWith('ParentTypeName_SubDocument', { a: 456 });
      });

      it('of any', () => {
        expect(OP.getFieldConfig([null])).toEqual(['JSON']);
      });
    });

    it('function', () => {
      const valueAsFn = () => 'abracadabra';
      const res = OP.getFieldConfig(valueAsFn);
      expect(res).toBe('abracadabra');
    });

    it('object', () => {
      const spy = jest.spyOn(OP, 'createTC');
      const valueAsObj = { a: 123 };
      OP.getFieldConfig(valueAsObj, {
        typeName: 'ParentTypeName',
        fieldName: 'subDocument',
      });
      expect(spy).toHaveBeenCalledWith('ParentTypeName_SubDocument', valueAsObj);
    });
  });

  describe('createTC()', () => {
    it('return ObjectTypeComposer', () => {
      const tc = OP.createTC('MyType', { a: 1 });
      expect(tc).toBeInstanceOf(ObjectTypeComposer);
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
