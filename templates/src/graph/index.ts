import 'reflect-metadata';
import { OptionsData } from 'express-graphql';
import { buildSchema } from 'type-graphql';

export default async function () {
  const schema = await buildSchema({
    resolvers: [
    ],
  });

  const options: OptionsData = {
    schema,
  };

  return options;
}
