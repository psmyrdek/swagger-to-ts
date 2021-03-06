export interface OpenAPI2 {
  definitions?: { [key: string]: OpenAPI2SchemaObject };
  swagger: string;
  [key: string]: any; // handle other properties beyond swagger-to-ts’ concern
}

export type OpenAPI2Type =
  | 'array'
  | 'binary'
  | 'boolean'
  | 'byte'
  | 'date'
  | 'dateTime'
  | 'double'
  | 'float'
  | 'integer'
  | 'long'
  | 'number'
  | 'object'
  | 'password'
  | 'string';

export type OpenAPI2Reference = { $ref: string };

export interface OpenAPI2SchemaObject {
  additionalProperties?: OpenAPI2SchemaObject | OpenAPI2Reference | boolean;
  allOf?: OpenAPI2SchemaObject[];
  description?: string;
  enum?: string[];
  format?: string;
  items?: OpenAPI2SchemaObject | OpenAPI2Reference;
  oneOf?: (OpenAPI2SchemaObject | OpenAPI2Reference)[];
  properties?: { [index: string]: OpenAPI2SchemaObject | OpenAPI2Reference };
  required?: string[];
  title?: string;
  type?: OpenAPI2Type;
  [key: string]: any; // use this construct to allow arbitrary x-something properties
}
