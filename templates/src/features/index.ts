import { Router } from 'express';
const features = [
];
export default function (context: FeatureContext) {
  features.forEach(ft => {
    ft(context);
  });
}
export interface FeatureContext {
  app: Router;
}
