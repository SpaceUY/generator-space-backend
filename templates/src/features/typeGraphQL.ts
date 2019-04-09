import * as ExpressGraphQL from 'express-graphql';
import graph from '../graph';
import { FeatureContext } from '.';

export default async function ({ app }: FeatureContext) {
  app.use(ExpressGraphQL(await graph()));
}
