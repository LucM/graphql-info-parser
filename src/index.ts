import {
  GraphQLSchema,
  GraphQLResolveInfo,
  ObjectTypeDefinitionNode,
  SelectionSetNode,
  NamedTypeNode,
  FieldDefinitionNode,
  ListTypeNode,
  FieldNode,
  ArgumentNode,
  ValueNode,
} from 'graphql';

function formatArgValue(value: ValueNode, variables: any): any {
  switch (value.kind) {
    case 'Variable':
      return variables[value.name.value];
    case 'ListValue':
      return value.values.map(arg => formatArgValue(arg, variables));
    case 'NullValue':
      return null;
    case 'ObjectValue':
      return value.fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name.value]: formatArgValue(field.value, variables),
        }),
        {},
      );
    default:
      return value.value;
  }
}

export interface IInfoDirective {
  [key: string]: any;
}

export interface IInfoDirectives {
  [key: string]: IInfoDirective;
}

function formatDirectives(astNode: ObjectTypeDefinitionNode | FieldDefinitionNode, variables: any): IInfoDirectives {
  return (
    astNode.directives
      ?.map(directive => ({
        name: directive.name.value,
        args: directive.arguments?.reduce((acc, arg) => {
          return {
            ...acc,
            [(arg.name as any).value]: formatArgValue(arg.value, variables),
          };
        }, {}),
      }))
      .reduce((acc, dir) => {
        return {
          ...acc,
          [dir.name]: dir.args,
        };
      }, {}) || {}
  );
}
export interface IInfoArgs {
  [key: string]: any;
}

function formatArgs(args: readonly ArgumentNode[] | undefined = [], variables: any): IInfoArgs {
  return args.reduce((acc, arg) => {
    return {
      ...acc,
      [arg.name.value]: formatArgValue(arg.value, variables),
    };
  }, {});
}

export interface IInfoNode {
  name: string;
  directivesObject: IInfoDirectives;
  type: string;
  isList: boolean;
  args: IInfoArgs;
  fields?: IInfoField[];
}

export interface IInfoField extends IInfoNode {
  directivesField: IInfoDirectives;
}

function formatFields(
  selectionSet: SelectionSetNode,
  schema: GraphQLSchema,
  astNode: ObjectTypeDefinitionNode,
  variables: any,
): IInfoField[] {
  return selectionSet.selections
    .filter(field => field.kind === 'Field')
    .map(f => {
      const field = f as FieldNode;
      const ast = astNode.fields?.find(fAstNode => fAstNode.name.value === field.name.value);
      const directivesField = ast ? formatDirectives(ast, variables) : {};
      let isList = false;
      let type = '';
      if (ast) {
        if (ast.type.kind === 'ListType') {
          isList = true;
          type = ((ast.type as ListTypeNode).type as NamedTypeNode).name.value;
        } else {
          type = (ast.type as NamedTypeNode).name.value;
        }
      }
      return {
        directivesField,
        ...formatNode(field as FieldNode, schema, isList ? `[${type}]` : type, variables),
      };
    });
}

function formatNode(node: FieldNode | undefined, schema: GraphQLSchema, type: string, variables: any): IInfoNode {
  if (!node) {
    return {
      name: 'undefined',
      directivesObject: {},
      type: 'undefined',
      isList: false,
      args: {},
    };
  }
  const isList = type[0] === '[';
  const objType = isList ? type.substr(1, type.length - 2) : type;
  const args = formatArgs(node.arguments, variables);
  const astNode = schema.getType(objType)?.astNode as ObjectTypeDefinitionNode;

  return {
    name: node.name.value,
    directivesObject: astNode ? formatDirectives(astNode, variables) : {},
    type: objType,
    isList,
    args,
    ...(node.selectionSet ? { fields: formatFields(node.selectionSet, schema, astNode, variables) } : {}),
  };
}

export const infoParser = (info: GraphQLResolveInfo): IInfoNode | null => {
  const { fieldName, returnType, fieldNodes } = info;
  const currentNode = fieldNodes.find(({ name }) => name.value === fieldName);
  return formatNode(currentNode, info.schema, returnType.toString(), info.variableValues);
};
