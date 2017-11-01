/* @flow */

import { graphql, TypeComposer, upperFirst, type ComposeFieldConfig } from 'graphql-compose';

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
      fields[k] = this.getFieldConfig(json[k], { typeName: name, fieldName: k });
    });

    tc.setFields(fields);

    return tc;
  }

  static getFieldConfig(value: any, opts: ?GetValueOpts): ComposeFieldConfig<any, any> {
    const typeOf = typeof value;

    if (typeOf === 'number') return 'Float';
    if (typeOf === 'string') return 'String';
    if (typeOf === 'boolean') return 'Boolean';

    if (typeOf === 'object') {
      if (value === null) return 'JSON';

      if (Array.isArray(value)) {
        const val = value[0];
        if (Array.isArray(val)) return ['JSON'];
        return [(this.getFieldConfig(val): any)];
      }

      if (opts && opts.typeName && opts.fieldName) {
        return this.createTC(`${opts.typeName}_${upperFirst(opts.fieldName)}`, value);
      }
    }

    if (typeOf === 'function') {
      return this.getFieldConfigFromFunction(value);
    }

    return 'JSON';
  }

  static getFieldConfigFromFunction(value: () => any): ComposeFieldConfig<any, any> {
    const fc = value();

    if (typeof fc === 'string') return fc;
    if (isOutputType(fc)) return fc;
    if (fc instanceof TypeComposer) return fc;
    if (fc && typeof fc === 'object' && fc.type) return fc;

    throw new Error(
      'Your type function should return: `string`, `GraphQLOutputType`, `TypeComposer`, `FieldConfig`.'
    );
  }
}
