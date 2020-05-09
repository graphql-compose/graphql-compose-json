import { InputTypeComposer } from 'graphql-compose';
import IOP from '../InputObjectParser';

describe('InputObjectParser', () => {
  describe('getFieldConfig()', () => {
    it('number', () => {
      expect(IOP.getFieldConfig(6)).toBe('Float');
      expect(IOP.getFieldConfig(77.7)).toBe('Float');
    });

    it('string', () => {
      expect(IOP.getFieldConfig('test')).toBe('String');
    });

    it('boolean', () => {
      expect(IOP.getFieldConfig(true)).toBe('Boolean');
      expect(IOP.getFieldConfig(false)).toBe('Boolean');
    });

    it('null', () => {
      expect(IOP.getFieldConfig(null)).toBe('JSON');
    });

    describe('array', () => {
      it('of number', () => {
        expect(IOP.getFieldConfig([1, 2, 3])).toEqual(['Float']);
      });

      it('of string', () => {
        expect(IOP.getFieldConfig(['a', 'b', 'c'])).toEqual(['String']);
      });

      it('of boolean', () => {
        expect(IOP.getFieldConfig([false, true])).toEqual(['Boolean']);
      });

      it('of object', () => {
        const spy = jest.spyOn(IOP, 'createITC');
        const valueAsArrayOfObjects = [{ a: 123 }, { a: 456 }];
        IOP.getFieldConfig(valueAsArrayOfObjects, {
          typeName: 'ParentTypeName',
          fieldName: 'subDocument',
        });
        expect(spy).toHaveBeenCalledWith('ParentTypeName_SubDocument', { a: 456 });
      });

      it('of any', () => {
        expect(IOP.getFieldConfig([null])).toEqual(['JSON']);
      });
    });

    it('function', () => {
      const valueAsFn = () => 'abracadabra';
      const res = IOP.getFieldConfig(valueAsFn);
      expect(res).toBe('abracadabra');
    });

    it('object', () => {
      const spy = jest.spyOn(IOP, 'createITC');
      const valueAsObj = { a: 123 };
      IOP.getFieldConfig(valueAsObj, {
        typeName: 'ParentTypeName',
        fieldName: 'subDocument',
      });
      expect(spy).toHaveBeenCalledWith('ParentTypeName_SubDocument', valueAsObj);
    });
  });

  describe('createITC()', () => {
    it('return InputTypeComposer', () => {
      const tc = IOP.createITC('MyType', { a: 1 });
      expect(tc).toBeInstanceOf(InputTypeComposer);
      expect(tc.getTypeName()).toBe('MyType');
    });

    it('creates fields', () => {
      const tc = IOP.createITC('MyType', { a: 1, b: true });
      expect(tc.getFieldNames()).toEqual(['a', 'b']);
      expect(tc.getFieldTypeName('a')).toBe('Float');
      expect(tc.getFieldTypeName('b')).toBe('Boolean');
    });

    it('match snapshot', () => {
      const PeopleITC = IOP.createITC('PeopleInput', {
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

      expect(PeopleITC.toSDL({ deep: true, omitScalars: true })).toMatchInlineSnapshot(`
        "input PeopleInput {
          name: String
          height: Int
          mass: Int
          hair_color: String
          skin_color: String
          eye_color: String
          birth_year: String
          gender: String
          homeworld: PeopleInput_Homeworld
          films: [String]
          created: Date
          edited: String
        }

        input PeopleInput_Homeworld {
          name: String
          rotation_period: String
          orbital_period: String
          terrain: String
          surface_water: String
          population: Int
        }"
      `);
    });
  });
});
