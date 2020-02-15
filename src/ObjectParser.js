/* @flow */

import {
  ObjectTypeComposer,
  upperFirst,
  type ObjectTypeComposerFieldConfigDefinition,
} from 'graphql-compose';

type GetValueOpts = {
  typeName: string,
  fieldName: string,
};

export default class ObjectParser {
  static createTC(name: string, json: Object): ObjectTypeComposer<any, any> {
    if (!json || typeof json !== 'object') {
      throw new Error('You provide empty object in second arg for `createTC` method.');
    }

    const tc = ObjectTypeComposer.createTemp(name);
    Object.keys(json).forEach(fieldName => {
      const fieldConfig = this.getFieldConfig(json[fieldName], { typeName: name, fieldName });
      tc.setField(fieldName, fieldConfig);
    });

    return tc;
  }

  static getFieldConfig(
    value: any,
    opts: ?GetValueOpts
  ): ObjectTypeComposerFieldConfigDefinition<any, any> {
    const typeOf = typeof value;

    if (typeOf === 'number') return 'Float';
    if (typeOf === 'string') return 'String';
    if (typeOf === 'boolean') return 'Boolean';

    if (typeOf === 'object') {
      if (value === null) return 'JSON';

      if (Array.isArray(value)) {
        if (Array.isArray(value[0])) return ['JSON'];

        const val =
          typeof value[0] === 'object' && value[0] !== null
            ? Object.assign({}, ...value)
            : value[0];

        const args =
          opts && opts.typeName && opts.fieldName
            ? {
                typeName: opts.typeName,
                fieldName: opts.fieldName,
              }
            : {};
        return [(this.getFieldConfig(val, args): any)];
      }

      if (opts && opts.typeName && opts.fieldName) {
        return this.createTC(`${opts.typeName}_${upperFirst(opts.fieldName)}`, value);
      }
    }

    if (typeOf === 'function') {
      return value();
    }
    return 'JSON';
  }
}
