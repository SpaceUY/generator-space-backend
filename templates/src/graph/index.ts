import 'reflect-metadata';
import { OptionsData, GraphQLParams } from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { Request, Response } from 'express';

export default async function ():
Promise<(req: Request, res: Response, params?: GraphQLParams | undefined) => OptionsData> {
  const schema = await buildSchema({
    resolvers: [],
  });

  return (): OptionsData => ({
    schema,
  });
}
