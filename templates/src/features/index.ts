import { Router } from 'express';
const features: Features = [
];
export default async function (context: FeatureContext) {
  for (const feature of features) {
    await feature(context);
  }
}
export interface FeatureContext {
  app: Router;
}
type Features = ((ctx: FeatureContext) => void)[];