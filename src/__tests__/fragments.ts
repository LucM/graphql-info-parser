import { testInfoFormater, resolverReturn } from './utils';
import * as GraphqlInfoParser from '../index';

const infoSpy = jest.spyOn(GraphqlInfoParser, 'infoParser');

describe('SubObj', () => {
  beforeEach(() => {
    infoSpy.mockClear();
  });

  const tester = testInfoFormater({
    infoSpy,
    typeDefs: `
      type Obj {
        foo: String
        bar: String
        subObj: SubObj
      }

      type SubObj {
        foo: String
      }

      type Query {
        getObj: Obj
      }
  `,
    resolvers: {
      Query: {
        getObj: resolverReturn(null),
      },
    },
  });
  test('FragmentSpread', async () => {
    return tester({
      query: `
        fragment ObjFragment on Obj {
          subObj {
              foo
            }
        }

        query {
          getObj {
            foo
            ...ObjFragment
          }
        }
      `,
      infoReturn: {
        name: 'getObj',
        args: {},
        type: 'Obj',
        directivesObject: {},
        isList: false,
        fields: [
          {
            isList: false,
            type: 'String',
            name: 'foo',
            directivesField: {},
            directivesObject: {},
            args: {},
          },
          {
            type: 'SubObj',
            name: 'subObj',
            isList: false,
            directivesField: {},
            directivesObject: {},
            args: {},
            fields: [
              {
                isList: false,
                type: 'String',
                name: 'foo',
                directivesField: {},
                directivesObject: {},
                args: {},
              },
            ],
          },
        ],
      },
    });
  });
  test('InlineFragment', async () => {
    return tester({
      query: `
        query {
          getObj {
            foo
            ... on Obj {
              subObj {
                foo
              }
            }
          }
        }
      `,
      infoReturn: {
        name: 'getObj',
        args: {},
        type: 'Obj',
        directivesObject: {},
        isList: false,
        fields: [
          {
            isList: false,
            type: 'String',
            name: 'foo',
            directivesField: {},
            directivesObject: {},
            args: {},
          },
          {
            type: 'SubObj',
            name: 'subObj',
            isList: false,
            directivesField: {},
            directivesObject: {},
            args: {},
            fields: [
              {
                isList: false,
                type: 'String',
                name: 'foo',
                directivesField: {},
                directivesObject: {},
                args: {},
              },
            ],
          },
        ],
      },
    });
  });
});
