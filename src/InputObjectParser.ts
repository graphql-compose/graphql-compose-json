import {
  InputTypeComposer,
  upperFirst,
  InputTypeComposerFieldConfigDefinition,
  schemaComposer,
  SchemaComposer,
} from 'graphql-compose';

type GetValueOpts = {
  typeName?: string;
  fieldName?: string;
};

export default class InputObjectParser {
  static createITC(
    name: string,
    json: Record<string, any>,
    opts?: { schemaComposer: SchemaComposer<any> }
  ): InputTypeComposer<any> {
    if (!json || typeof json !== 'object') {
      throw new Error('You provide empty object in second arg for `createITC` method.');
    }

    const sc = opts?.schemaComposer || schemaComposer;

    const tc = sc.createInputTC(name);
    Object.keys(json).forEach((fieldName) => {
      const fieldConfig = this.getFieldConfig(json[fieldName], { typeName: name, fieldName });
      tc.setField(fieldName, fieldConfig);
    });

    return tc;
  }

  static getFieldConfig(
    value: any,
    opts?: GetValueOpts | null
  ): InputTypeComposerFieldConfigDefinition {
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
        return [this.getFieldConfig(val, args)] as any;
      }

      if (opts && opts.typeName && opts.fieldName) {
        return this.createITC(`${opts.typeName}_${upperFirst(opts.fieldName)}`, value);
      }
    }

    if (typeOf === 'function') {
      return value();
    }
    return 'JSON';
  }
}
