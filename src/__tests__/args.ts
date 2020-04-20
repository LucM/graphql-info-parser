import { testInfoFormater, resolverReturn } from './utils';
import * as GraphqlInfoParser from '../index';

const infoSpy = jest.spyOn(GraphqlInfoParser, 'infoParser');

describe('Args', () => {
  beforeEach(() => {
    infoSpy.mockClear();
  });

  const tester = testInfoFormater({
    infoSpy,
    typeDefs: `
      input SubObj {
        foo: String
      }

      input Obj {
        subObj: SubObj
      }

      type Query {
        getObj(
          arg1: Int,
          arg2: [String]
          arg3: Float
          arg4: Obj
          arg5: Boolean
        ): String
      }
  `,
    resolvers: {
      Obj: {},
      Query: {
        getObj: resolverReturn(null),
      },
    },
  });
  test('Argument Root', async () => {
    return tester({
      query: `
        query {
          getObj(
            arg1: 12,
            arg2: ["f", "oo"],
            arg3: 12.2,
            arg4: { subObj: { foo: "ok" } },
            arg5: true
          )
        }
      `,
      infoReturn: {
        name: 'getObj',
        args: {
          arg1: 12,
          arg2: ['f', 'oo'],
          arg3: 12.2,
          arg4: { subObj: { foo: 'ok' } },
          arg5: true,
        },
        type: 'String',
        directivesObject: {},
        isList: false,
      },
    });
  });
  test('with vars', async () => {
    return tester({
      query: `
        query test($test: Int) {
          getObj(
            arg1: $test
          )
        }
      `,
      variables: {
        test: 2,
      },
      infoReturn: {
        name: 'getObj',
        args: {
          arg1: 2,
        },
        type: 'String',
        directivesObject: {},
        isList: false,
      },
    });
  });
});
