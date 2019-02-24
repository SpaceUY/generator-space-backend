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
        lint: 'tslint --project tsconfig.json src/**/*.ts',
        'lint:one': 'tslint --project tsconfig.json',
        'lint:write': 'tslint --project tsconfig.json src/**/*.ts --fix',
        'lint:write:one': 'tslint --project tsconfig.json --fix',
        prettier: 'prettier --write src/**/*.ts',
        'prettier:one': 'prettier --write',
        lintAndPretty: 'npm run prettier && npm run lint:write',
      },
      devDependencies: {
        husky: '^1.2.0',
        'lint-staged': '^8.1.0',
        prettier: '^1.15.2',
        tslint: '^5.11.0',
        'tslint-config-airbnb': '^5.11.1',
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

  npmLint(yo);

  yo.fs.extendJSON(
    yo.destinationPath('.vscode/settings.json'),
    {
      'editor.formatOnSave': false,
      'tslint.autoFixOnSave': true,
    },
  );
}

function writeSrc(yo) {
  file.addFile(
    yo,
    'src/index.ts',
  );

  file.addFile(
    yo,
    'src/routes/index.ts',
  );

  file.addFile(
    yo,
    'src/features/index.ts',
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
