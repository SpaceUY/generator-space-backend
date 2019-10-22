// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');
const fs = require('fs');
const file = require('../../util/files');

/**
 * Adds dependencies for Linting
 * @param {Generator} yo
 */
function npmLint(yo) {
  yo.fs.extendJSON(
    yo.destinationPath('package.json'),
    {
      scripts: {
        lint: 'eslint src/**/*.ts',
        'lint:one': 'eslint',
        'lint:write': 'eslint src/**/*.ts --fix',
        'lint:write:one': 'eslint --fix',
        prettier: 'prettier --write src/**/*.ts',
        'prettier:one': 'prettier --write',
        lintAndPretty: 'npm run prettier && npm run lint:write',
      },
      devDependencies: {
        husky: '^1.2.0',
        'lint-staged': '^8.1.0',
        prettier: '^1.15.2',
        '@typescript-eslint/eslint-plugin': '^1.7.0',
        '@typescript-eslint/parser': '^1.7.0',
        eslint: '^5.3.0',
        'eslint-config-airbnb-base': '^13.1.0',
        'eslint-plugin-import': '^2.14.0',
      },
      husky: {
        hooks: {
          'pre-commit': 'lint-staged',
        },
      },
      'lint-staged': {
        '*.(ts|tsx)': [
          'npm run prettier:one',
          'npm run lint:write:one',
          'git add',
        ],
      },
    },
  );
}

/**
 * @param {Generator} yo
 */
function writeMain(yo, appname) {
  yo.fs.copyTpl(
    yo.templatePath('main/package.json'),
    yo.destinationPath('package.json'),
    {
      appname,
    },
  );

  yo.fs.copy(
    yo.templatePath('main/.env'),
    yo.destinationPath('.env'),
  );
  yo.fs.copy(
    yo.templatePath('main/gitignore.txt'),
    yo.destinationPath('.gitignore'),
  );
  yo.fs.copy(
    yo.templatePath('main/tsconfig.json'),
    yo.destinationPath('tsconfig.json'),
  );
  yo.fs.copy(
    yo.templatePath('main/.vscode/**'),
    yo.destinationPath('.vscode'),
  );
  yo.fs.copy(
    yo.templatePath('main/gulpfile.js'),
    yo.destinationPath('gulpfile.js'),
  );
  yo.fs.copy(
    yo.templatePath('../README.md'),
    yo.destinationPath('space-backend.md'),
  );
}

/**
 *
 * @param {Generator} yo
 */
function writeLint(yo) {
  yo.fs.copy(
    yo.templatePath('linting/**'),
    yo.destinationPath(),
  );

  yo.fs.copy(
    yo.templatePath('linting/.editorconfig'),
    yo.destinationPath('.editorconfig'),
  );

  yo.fs.copy(
    yo.templatePath('linting/.eslintrc.js'),
    yo.destinationPath('.eslintrc.js'),
  );

  npmLint(yo);
}

function writeSrc(yo) {
  file.addFiles(
    yo,
    [
      'src/index.ts',
      'src/routes/index.ts',
      'src/features/index.ts',
      'src/util/cors.ts',
    ],
  );
}

/**
 *
 * @param {Generator} yo
 */
module.exports = function writeFiles(yo, answers) {
  yo.log('Writing project files...');
  writeMain(yo, answers.appname);
  yo.log('Writing Linting files...');
  writeLint(yo);

  writeSrc(yo);

  yo.config.set(
    'version',
    JSON.parse(fs.readFileSync(yo.templatePath('../package.json'), 'utf8')).version,
  );
  yo.config.set('features', []);
  yo.config.set('middleware', []);

  yo.log('Finished writing files.');
};
