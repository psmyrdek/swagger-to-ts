[![version
(scoped)](https://img.shields.io/npm/v/@manifoldco/swagger-to-ts.svg)](https://www.npmjs.com/package/@manifoldco/swagger-to-ts)
[![codecov](https://codecov.io/gh/manifoldco/swagger-to-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/manifoldco/swagger-to-ts)

# 📘️ swagger-to-ts

Convert [OpenAPI v2][openapi2] schemas to TypeScript interfaces using Node.js. It can handle large
definition files within milliseconds because it neither validates nor parses; it only transforms the
bare minimum of what it needs to.

💅 Prettifies output with [Prettier][prettier].

To compare actual generated output, see the [example](./example) folder.

## Usage

### CLI

```bash
npx @manifoldco/swagger-to-ts schema.yaml --output schema.d.ts

# 🚀 schema.yaml -> schema.d.ts [500ms]
```

This will save a `schema.d.ts` file in the current folder under the TypeScript
[namespace][namespace] `OpenAPI` (namespaces are required because chances of collision among specs
is highly likely). The CLI can accept YAML or JSON for the input file.

#### Generating multiple schemas

Say you have multiple schemas you need to parse. I’ve found the simplest way to do that is to use
npm scripts. In your `package.json`, you can do something like the following:

```json
"scripts": {
  "generate:specs": "npm run generate:specs:one && npm run generate:specs:two",
  "generate:specs:one": "npx @manifoldco/swagger-to-ts one.yaml -o one.d.ts",
  "generate:specs:two": "npx @manifoldco/swagger-to-ts two.yaml -o two.d.ts"
}
```

Rinse and repeat for more specs.

For anything more complicated, or for generating specs dynamically, you can also use the Node API
(below).

#### CLI Options

| Option                | Alias | Default  | Description                            |
| :-------------------- | :---- | :------: | :------------------------------------- |
| `--output [location]` | `-o`  | (stdout) | Where should the output file be saved? |

### Node

```bash
npm i --save-dev @manifoldco/swagger-to-ts
```

```js
const { readFileSync } = require('fs');
const swaggerToTS = require('@manifoldco/swagger-to-ts');

const input = JSON.parse(readFileSync('spec.json', 'utf8')); // Input can be any JS object (OpenAPI format)
const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)
```

The Node API is a bit more flexible: it will only take a JS object as input (OpenAPI format), and
return a string of TS definitions. This lets you pull from any source (a Swagger server, local
files, etc.), and similarly lets you parse, post-process, and save the output anywhere.

If your specs are in YAML, you’ll have to convert them to JS objects using a library such as
[js-yaml][js-yaml]. If you’re batching large folders of specs, [glob][glob] may also come in handy.

#### PropertyMapper

In order to allow more control over how properties are parsed, and to specifically handle
`x-something`-properties, the `propertyMapper` option may be specified as the optional 2nd
parameter.

This is a function that, if specified, is called for each property and allows you to change how
swagger-to-ts handles parsing of Swagger files.

An example on how to use the `x-nullable` property to control if a property is optional:

```js
const getNullable = (d: { [key: string]: any }): boolean => {
  const nullable = d['x-nullable'];
  if (typeof nullable === 'boolean') {
    return nullable;
  }
  return true;
};

const output = swaggerToTS(swagger, (swaggerDefinition, property): Property => ({
  ...property,
  optional: getNullable(swaggerDefinition),
}));
```

[glob]: https://www.npmjs.com/package/glob
[js-yaml]: https://www.npmjs.com/package/js-yaml
[openapi2]: https://swagger.io/specification/v2/
[openapi3]: https://swagger.io/specification
[namespace]: https://www.typescriptlang.org/docs/handbook/namespaces.html
[prettier]: https://npmjs.com/prettier
