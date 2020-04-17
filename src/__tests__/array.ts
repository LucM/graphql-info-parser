import { testInfoFormater, resolverReturn } from './utils';
import * as GraphqlInfoParser from '../index';

const infoSpy = jest.spyOn(GraphqlInfoParser, 'infoParser');

describe('Array', () => {
  beforeEach(() => {
    infoSpy.mockClear();
  });

  const tester = testInfoFormater({
    infoSpy,
    typeDefs: `
      type Obj {
        foo: String
        bar: String
        subObjs: [SubObj]
      }

      type SubObj {
        foo: String
      }

      type Query {
        getObj: Obj
        getObjs: [Obj]
      }
  `,
    resolvers: {
      Obj: {},
      Query: {
        getObj: resolverReturn(null),
        getObjs: resolverReturn(null),
      },
    },
  });
  test('Array root level', async () => {
    return tester({
      query: `
        query {
          getObjs {
            foo
          }
        }
      `,
      infoReturn: {
        name: 'getObjs',
        type: 'Obj',
        directivesObject: {},
        args: {},
        isList: true,
        fields: [
          {
            type: 'String',
            name: 'foo',
            isList: false,
            directivesField: {},
            directivesObject: {},
            args: {},
          },
        ],
      },
    });
  });
  test('Array field level', async () => {
    return tester({
      query: `
        query {
          getObj{
            subObjs {
              foo
            }
          }
        }
      `,
      infoReturn: {
        name: 'getObj',
        type: 'Obj',
        directivesObject: {},
        args: {},
        isList: false,
        fields: [
          {
            type: 'SubObj',
            name: 'subObjs',
            isList: true,
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
