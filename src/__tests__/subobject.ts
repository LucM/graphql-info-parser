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
        bar: String!
        subObj: SubObj!
      }

      type SubObj {
        foo: String!
      }

      type Query {
        getObj: Obj
      }
  `,
    resolvers: {
      Obj: {},
      Query: {
        getObj: resolverReturn(null),
      },
    },
  });
  test('Simple Object', async () => {
    return tester({
      query: `
        query {
          getObj {
            foo
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
        ],
      },
    });
  });
  test('Subobject', async () => {
    return tester({
      query: `
        query {
          getObj {
            subObj {
              foo
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
