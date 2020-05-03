import { testInfoFormater, resolverReturn } from './utils';
import * as GraphqlInfoParser from '../index';

const infoSpy = jest.spyOn(GraphqlInfoParser, 'infoParser');

describe('Scalar', () => {
  beforeEach(() => {
    infoSpy.mockClear();
  });

  const tester = testInfoFormater({
    infoSpy,
    typeDefs: `
    scalar myScalar

    type Query {
      getString: String
      getBoolean: Boolean!
      getInt: Int
      getFloat: Float!
      getStrings: [String]!
      getScalar: myScalar
    }
  `,
    resolvers: {
      Query: {
        getString: resolverReturn(null),
        getBoolean: resolverReturn(null),
        getInt: resolverReturn(null),
        getFloat: resolverReturn(null),
        getStrings: resolverReturn(null),
        getScalar: resolverReturn(null),
      },
    },
  });
  test('String', () => {
    return tester({
      query: `
        query {
          getString
        }
      `,
      infoReturn: {
        name: 'getString',
        args: {},
        type: 'String',
        directivesObject: {},
        isList: false,
      },
    });
  });
  test('Boolean', () => {
    return tester({
      query: `
        query {
          getBoolean
        }
      `,
      infoReturn: {
        name: 'getBoolean',
        args: {},
        type: 'Boolean',
        directivesObject: {},
        isList: false,
      },
    });
  });
  test('Int', () => {
    return tester({
      query: `
        query {
          getInt
        }
      `,
      infoReturn: {
        name: 'getInt',
        args: {},
        type: 'Int',
        directivesObject: {},
        isList: false,
      },
    });
  });
  test('Float', () => {
    return tester({
      query: `
        query {
          getFloat
        }
      `,
      infoReturn: {
        name: 'getFloat',
        type: 'Float',
        args: {},
        directivesObject: {},
        isList: false,
      },
    });
  });
  test('Array String', () => {
    return tester({
      query: `
        query {
          getStrings
        }
      `,
      infoReturn: {
        name: 'getStrings',
        type: 'String',
        args: {},
        directivesObject: {},
        isList: true,
      },
    });
  });
  test('Scalar', () => {
    return tester({
      query: `
        query {
          getScalar
        }
      `,
      infoReturn: {
        name: 'getScalar',
        type: 'myScalar',
        args: {},
        directivesObject: {},
        isList: false,
      },
    });
  });
});
