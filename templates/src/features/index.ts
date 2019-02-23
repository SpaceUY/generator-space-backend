import { Router } from 'express';
const features: Features = [
];
export default function (context: FeatureContext) {
  features.forEach(ft => {
    ft(context);
  });
}
export interface FeatureContext {
  app: Router;
}
type Features = ((ctx: FeatureContext) => void)[];