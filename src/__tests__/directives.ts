import { testInfoFormater, resolverReturn } from './utils';
import * as GraphqlInfoParser from '../index';

const infoSpy = jest.spyOn(GraphqlInfoParser, 'infoParser');

describe('Directives', () => {
  beforeEach(() => {
    infoSpy.mockClear();
  });
  const tester = testInfoFormater({
    infoSpy,
    typeDefs: `
    directive @onObjectWithoutArgs on OBJECT
    directive @onObjectWithArgs(arg1: String, arg2: Int) on OBJECT

    directive @onFieldWithoutArgs on FIELD_DEFINITION
    directive @onFieldWithArgs(arg1: String, arg2: Int) on FIELD_DEFINITION

    type Obj1 @onObjectWithoutArgs {
      name: String
    }

    type Obj2 @onObjectWithArgs(arg1: "foo", arg2: 42) {
      name: String
    }

    type Obj3 {
      withoutArgs: String @onFieldWithoutArgs
      withArgs: String @onFieldWithArgs(arg1: "foo", arg2: 42)
    }

    type Query {
      getObj1: Obj1
      getObj2: Obj2
      getObj3: Obj3
    }
  `,
    resolvers: {
      Query: {
        getObj1: resolverReturn(null),
        getObj2: resolverReturn(null),
        getObj3: resolverReturn(null),
      },
    },
  });
  test('on Obj without args', () => {
    return tester({
      query: `
        query {
          getObj1 {
            name
          }
        }
      `,
      infoReturn: {
        type: 'Obj1',
        name: 'getObj1',
        args: {},
        isList: false,
        directivesObject: {
          onObjectWithoutArgs: {},
        },
        fields: [
          {
            args: {},
            directivesObject: {},
            directivesField: {},
            isList: false,
            type: 'String',
            name: 'name',
          },
        ],
      },
    });
  });
  test('on Obj with args', async () => {
    return tester({
      query: `
        query {
          getObj2 {
            name
          }
        }
      `,
      infoReturn: {
        name: 'getObj2',
        type: 'Obj2',
        isList: false,
        args: {},
        directivesObject: {
          onObjectWithArgs: {
            arg1: 'foo',
            arg2: '42',
          },
        },
        fields: [
          {
            args: {},
            directivesObject: {},
            directivesField: {},
            isList: false,
            type: 'String',
            name: 'name',
          },
        ],
      },
    });
  });
  test('on Field without args', async () => {
    return tester({
      query: `
        query {
          getObj3 {
            withoutArgs
          }
        }
      `,
      infoReturn: {
        name: 'getObj3',
        type: 'Obj3',
        isList: false,
        directivesObject: {},
        args: {},
        fields: [
          {
            directivesField: {
              onFieldWithoutArgs: {},
            },
            directivesObject: {},
            args: {},
            isList: false,
            type: 'String',
            name: 'withoutArgs',
          },
        ],
      },
    });
  });
  test('on Field with args', async () => {
    return tester({
      query: `
        query {
          getObj3 {
            withArgs
          }
        }
      `,
      infoReturn: {
        name: 'getObj3',
        type: 'Obj3',
        isList: false,
        directivesObject: {},
        args: {},
        fields: [
          {
            directivesObject: {},
            directivesField: {
              onFieldWithArgs: {
                arg1: 'foo',
                arg2: '42',
              },
            },
            args: {},
            isList: false,
            type: 'String',
            name: 'withArgs',
          },
        ],
      },
    });
  });
});
