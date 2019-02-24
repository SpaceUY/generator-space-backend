const { Feature } = require('./features');

/**
 * @typedef FeatureList
 * @type {Feature[]}
 * @property {(string) => Feature} get
 */

/** @type {FeatureList} */
const featureList = [
  new Feature(
    'Typegoose',
    'A typescript layer of Mongoose. (Note: This feature will require you to include a uri to a MongoDB database as DB_URI in the .env file)',
    'typegoose',
    ['mongoose', 'typegoose'],
    ['@types/mongoose'],
    {
      featureFilePaths: [
        'src/models/index.ts',
      ],
    },
  ),
  new Feature(
    'TypeGraphQL',
    'A typescript layer of GraphQL',
    'typeGraphQL',
    ['express-graphql', 'type-graphql'],
    ['@types/express-graphql'],
    {
      featureFilePaths: [
        'src/graph/index.ts',
      ],
    },
  ),
  new Feature(
    'Passport',
    'Used for handling authentication. By default, it comes with PassportJS\'s Local Strategy',
    'passport',
    ['passport', 'passport-local'],
    ['@types/passport', '@types/passport-local'],
  ),
];

featureList.get = function get(name) {
  return this.find(ft => ft.fileName === name);
};

module.exports = featureList;
