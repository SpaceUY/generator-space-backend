// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');

const dependencyList = {
  mongoose: '^5.3.14',
  typegoose: '^5.4.1',
  'express-graphql': '^0.7.1',
  'type-graphql': '^0.15.0',
  passport: '^0.4.0',
  'passport-local': '^1.0.0',
  test: '1.0.0',
};

const devDependencyList = {
  husky: '^1.2.0',
  'lint-staged': '^8.1.0',
  prettier: '^1.15.2',
  tslint: '^5.11.0',
  'tslint-config-airbnb': '^5.11.1',
  '@types/mongoose': '^5.3.2',
  '@types/express-graphql': '^0.6.2',
  '@types/passport': '^0.4.7',
  '@types/passport-local': '^1.0.33',
  testDev: '1.0.0',
};

/**
 *
 * @param {Generator} yo
 * @param {string[]} dep
 * @param {string[]} dev
 */
function addDependencies(yo, dep, dev) {
  const dependencies = dep.reduce((acc, cur) => {
    acc[cur] = dependencyList[cur];
    return acc;
  }, {});
  const devDependencies = dev.reduce((acc, cur) => {
    acc[cur] = devDependencyList[cur];
    return acc;
  }, {});
  yo.fs.extendJSON(
    yo.destinationPath('package.json'),
    {
      dependencies,
      devDependencies,
    },
  );
}

/**
 *
 * @param {Generator} yo
 * @param {string[]} dep
 */
function removeDependencies(yo, dep) {
  const pkg = yo.fs.readJSON(yo.destinationPath('package.json'));
  dep.forEach((d) => {
    pkg.dependencies[d] = undefined;
    pkg.devDependencies[d] = undefined;
  });

  yo.fs.writeJSON(yo.destinationPath('package.json'), pkg);
}

module.exports = {
  addDependencies,
  removeDependencies,
};
