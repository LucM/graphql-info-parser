import { makeExecutableSchema, IResolvers, ITypeDefinitions } from 'graphql-tools';
import { graphql } from 'graphql';
import { GraphQLResolveInfo } from 'graphql';
import { infoParser, IInfoNode } from '../index';

export const testInfoFormater = ({
  infoSpy,
  resolvers,
  typeDefs,
}: {
  infoSpy: any;
  resolvers: IResolvers<any, any> | Array<IResolvers<any, any>>;
  typeDefs: ITypeDefinitions;
}) => async ({
  query,
  infoReturn,
  variables,
}: {
  infoReturn: IInfoNode;
  query: any;
  variables?: any;
}): Promise<void> => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  await graphql(schema, query, null, null, variables);
  expect(infoSpy).toHaveReturnedWith(infoReturn);
};

export const resolverReturn = (toReturn: any) => (parent: any, args: any, ctx: any, info: GraphQLResolveInfo): any => {
  try {
    infoParser(info);
  } catch (err) {
    throw err;
  }
  return toReturn;
};
