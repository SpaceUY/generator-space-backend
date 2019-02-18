import * as ExpressGraphQL from 'express-graphql';
import graph from '../graph';
import { FeatureContext } from '.';

export default function ({ app }: FeatureContext) {
  app.use(ExpressGraphQL(graph));
}
