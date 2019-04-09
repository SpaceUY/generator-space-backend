import 'reflect-metadata';
import { OptionsData, GraphQLParams } from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { Request, Response } from 'express';

export default async function () {
  const schema = await buildSchema({
    resolvers: [],
  });

  return (req: Request, res: Response, params?: GraphQLParams): OptionsData => {
    return {
      schema,
    };
  };
}
