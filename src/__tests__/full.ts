import { testInfoFormater, resolverReturn } from './utils';
import * as GraphqlInfoParser from '../index';

const infoSpy = jest.spyOn(GraphqlInfoParser, 'infoParser');

describe('Full', () => {
  beforeEach(() => {
    infoSpy.mockClear();
  });
  const tester = testInfoFormater({
    infoSpy,
    typeDefs: `
    directive @table(name: String) on OBJECT

    directive @field(field: String) on FIELD_DEFINITION
    directive @computed(fields: [String]) on FIELD_DEFINITION

    type User @table(name: "user") {
      id: ID! @field
      firstName: String @field
      lastName: String @field
      fullName: String @computed(fields: ["firstName", " ", "lastName"])
      posts(first: Int): [Post]
    }

    type Post @table(name: "post") {
      title: String @field
      content: String @field
    }

    type Query {
      user(id: ID!): User
    }
  `,
    resolvers: {
      Query: {
        user: resolverReturn(null),
      },
    },
  });
  test('on Obj without args', () => {
    return tester({
      query: `
        query {
          user(id: 123) {
            firstName
            lastName
            fullName
            posts(first: 12) {
              title
              content
            }
          }
        }
      `,
      infoReturn: {
        args: { id: '123' },
        directivesObject: { table: { name: 'user' } },
        isList: false,
        name: 'user',
        type: 'User',
        fields: {
          firstName: {
            args: {},
            directivesField: { field: {} },
            directivesObject: {},
            isList: false,
            name: 'firstName',
            type: 'String',
          },
          fullName: {
            args: {},
            directivesField: { computed: { fields: ['firstName', ' ', 'lastName'] } },
            directivesObject: {},
            isList: false,
            name: 'fullName',
            type: 'String',
          },
          lastName: {
            args: {},
            directivesField: { field: {} },
            directivesObject: {},
            isList: false,
            name: 'lastName',
            type: 'String',
          },
          posts: {
            args: { first: '12' },
            directivesField: {},
            directivesObject: { table: { name: 'post' } },
            isList: true,
            name: 'posts',
            type: 'Post',
            fields: {
              content: {
                args: {},
                directivesField: { field: {} },
                directivesObject: {},
                isList: false,
                name: 'content',
                type: 'String',
              },
              title: {
                args: {},
                directivesField: { field: {} },
                directivesObject: {},
                isList: false,
                name: 'title',
                type: 'String',
              },
            },
          },
        },
      },
    });
  });
});
