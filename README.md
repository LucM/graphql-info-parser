# GraphQL Info Parser

In the resolver, parse the `info` argument, to have a representation of the query based on the ast schema.

## Install

```
npm install --save graphql-info-parser
```

or

```
yarn add graphql-info-parser
```

## Usage

```ts
import { infoParser } from 'graphql-info-parser';

const Query = {
  users: (parents, args, ctx, info) => {
    const obj = infoParser(info);
    // { name: 'users', type: 'User', isList: true, args: { first: 10 }, directivesObject: {}, fields: { firstName ...
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

```graphqls
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
  fields: {
    firstName: {
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
      directivesField: { deprecated: true },
    },
    friends: {
      name: 'friends',
      type: 'User',
      isList: true,
      args: { limit: 5 },
      directivesObject: {},
      directivesField: {},
      firstName: {
        name: 'firstName',
        type: 'String',
        isList: false,
        args: {},
        directivesObject: {},
        directivesField: {},
      },
    },
  },
};
```
