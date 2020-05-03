# Graphql Info Parser

![](https://github.com/LucM/graphql-info-parser/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/graphql-info-parser.svg)](https://badge.fury.io/js/graphql-info-parser)

Graphql-info-parser helps you to take advantage of the info argument.
It transforms the info object into an understandable data structure, with all the necessary information of the query. (Directives, Args).
This way, you can for example generate an SQL request from the root resolver.

- Directives ok
- Args ok
- fragments ok
- interface TODO
- union TODO
- extends

## Install

### npm

```
npm install --save graphql-info-parser
```

### yarn

```
yarn add graphql-info-parser
```

## Usage

```ts
import { infoParser } from 'graphql-info-parser';

const Query = {
  users: (parents, args, ctx, info) => {
    const obj = infoParser(info);
  },
};
```

## Example

- schema.graphql

```graphql
type User {
  firstName: String
  lastName: String
  last_name: String @deprecated
  online: Boolean
  friends(limit: Int!): [User]
}

type Query {
  users: [User]
}
```

- query

```graphql
query {
  users {
    firstName
    last_name
    friends(limit: 5) {
      firstName
    }
  }
}
```

- resolver

```ts
import { infoParser } from 'graphql-info-parser';

const Query = {
  users: (parents, args, ctx, info) => {
    const obj = infoParser(info);
  },
};
```

- Result:

```ts
obj = {
  name: 'users',
  type: 'User',
  isList: true,
  args: {},
  directivesObject: {},
  fields: [{
      name: 'firstName',
      type: 'String',
      isList: false,
      args: {},
      directivesObject: {},
      directivesField: {},
    },
    last_name: {
      name: 'last_name',
      type: 'String',
      isList: false,
      args: {},
      directivesObject: {},
      directivesField: { deprecated: {} },
    },
    friends: {
      name: 'friends',
      type: 'User',
      isList: true,
      args: { limit: 5 },
      directivesObject: {},
      directivesField: {},
      fields: [{
        name: 'firstName',
        type: 'String',
        isList: false,
        args: {},
        directivesObject: {},
        directivesField: {},
      }]
    },
  ]
};
```
