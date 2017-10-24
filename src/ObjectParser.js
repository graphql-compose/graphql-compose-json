/* @flow */

import { graphql, TypeComposer, upperFirst } from 'graphql-compose';

const { isOutputType } = graphql;

type GetValueOpts = {
  typeName: string,
  fieldName: string,
};

export default class ObjectParser {
  static createTC(name: string, json: Object): TypeComposer {
    if (!json || typeof json !== 'object') {
      throw new Error('You provide empty object in second arg for `createTC` method.');
    }
    const tc = TypeComposer.create(name);

    const fields = {};
    Object.keys(json).forEach(k => {
      fields[k] = this.getValueType(json[k], { typeName: name, fieldName: k });
    });

    tc.setFields(fields);

    return tc;
  }

  static getValueType(
    value: any,
    opts: ?GetValueOpts
  ): string | [string] | graphql.GraphQLOutputType | TypeComposer {
    const typeOf = typeof value;

    if (typeOf === 'number') return 'Float';
    if (typeOf === 'string') return 'String';
    if (typeOf === 'boolean') return 'Boolean';

    if (typeOf === 'object') {
      if (value === null) return 'JSON';

      if (Array.isArray(value)) {
        const val = value[0];
        if (Array.isArray(val)) return ['JSON'];
        return [(this.getValueType(val): any)];
      }

      if (opts && opts.typeName && opts.fieldName) {
        return this.createTC(`${opts.typeName}_${upperFirst(opts.fieldName)}`, value);
      }
    }

    if (typeOf === 'function') {
      return this.getValueTypeFromFunction(value);
    }

    return 'JSON';
  }

  static getValueTypeFromFunction(
    value: () => any
  ): string | graphql.GraphQLOutputType | TypeComposer {
    const type = value();

    if (typeof type === 'string') return type;
    if (isOutputType(type)) return type;
    if (type instanceof TypeComposer) return type;

    throw new Error(
      'Your type function should return: `string`, `GraphQLOutputType`, `TypeComposer`.'
    );
  }
}
