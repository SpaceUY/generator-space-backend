import * as mongoose from 'mongoose';
import { FeatureContext } from '.';

export default function ({}: FeatureContext) {
  if (process.env.DB_URI === undefined) throw Error('DB_URI is not defined in .env file.');
  mongoose.connect(
  process.env.DB_URI as string,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  );
}
