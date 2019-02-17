// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');
const dep = require('../../util/dependencies');
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

/**
 * Writes files for Mongoose
 * @param {Generator} yo
 * @param {boolean} samples
 */
function writeMongoose(yo, samples) {
  let imports = '';
  let models = '';
  if (samples) {
    imports = `import User from \'./definitions/User\';
import Player from \'./definitions/Player\';
import Team from \'./definitions/Team\';`;

    models = `export const UserModel = new User().getModelForClass(User, schema);
export const PlayerModel = new Player().getModelForClass(Player, schema);
export const TeamModel = new Team().getModelForClass(Team, schema);`;
  }

  file.addFile(
    yo,
    'src/models/index.ts',
    {
      imports,
      models,
    },
  );

  if (samples) {
    file.addFolder(
      yo,
      'src/models/definitions/',
    );
  }
}

/**
 * Writes files for GraphQL
 * @param {Generator} yo
 * @param {boolean} samples
 */
function writeGraphQL(yo, samples) {
  let imports = '';
  let resolvers = '';

  if (samples) {
    imports = `\nimport PlayerResolver from './resolvers/PlayerResolver';
import TeamResolver from './resolvers/TeamResolver';\n`;

    resolvers = 'PlayerResolver, TeamResolver';
  }

  file.addFile(
    yo,
    'src/graph/index.ts',
    {
      imports,
      resolvers,
    },
  );

  if (samples) {
    file.addFolders(
      yo,
      [
        'src/graph/inputs/',
        'src/graph/resolvers/',
        'src/graph/types/',
      ],
    );
  }
}

/**
 * Writes files for PassportJS
 * @param {Generator} yo
 */
function writePassport(yo) {
  yo.fs.copy(
    yo.templatePath('src/configs/passport.ts'),
    yo.destinationPath('src/configs/passport.ts'),
  );
}

function writeSrc(yo, features, samples) {
  let imports = `import * as express from \'express\';
import * as bodyparser from \'body-parser\';
import * as cors from 'cors';`;

  let mongooseBody = '';
  let passport = '';
  let graphImport = '';
  let appUseGraph = '';

  // mongoose
  if (features.includes('mongoose')) {
    yo.log('Writing Mongoose files...');
    dep.addDependencies(yo, ['mongoose', 'typegoose'], ['@types/mongoose']);
    writeMongoose(yo, samples);

    imports += '\nimport * as mongoose from \'mongoose\';';
    mongooseBody = `\nif (process.env.DB_URI === undefined) throw Error('DB_URI is not defined in .env file.');\nmongoose.connect(
  process.env.DB_URI as string,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
);\n`;
  }

  // graphql
  if (features.includes('graphql')) {
    yo.log('Writing GraphQL files...');
    dep.addDependencies(yo, ['express-graphql', 'type-graphql'], ['@types/express-graphql']);
    writeGraphQL(yo, samples);

    imports += '\nimport * as ExpressGraphQL from \'express-graphql\';';
    graphImport = '\nimport graph from \'./graph\';';
    appUseGraph = 'app.use(ExpressGraphQL(graph));\n';
  }

  // passport
  if (features.includes('passport')) {
    yo.log('Writing PassportJS files...');
    dep.addDependencies(yo, ['passport', 'passport-local'], ['@types/passport', '@types/passport-local']);
    writePassport(yo);

    passport = '\nrequire(\'./configs/passport\');\n';
  }

  // middleware
  file.addFolder(
    yo,
    'src/middleware/',
  );

  // routes
  let routes = '';
  if (samples) {
    routes = `import auth from './auth';

app.use('/auth', auth);`;

    file.addFolder(
      yo,
      'src/routes/auth/',
    );
  }
  file.addFile(
    yo,
    'src/routes/index.ts',
    {
      routes,
    },
  );

  yo.log('Writing index.ts...');
  file.addFile(
    yo,
    'src/index.ts',
    {
      imports,
      mongooseBody,
      passport,
      graphImport,
      appUseGraph,
    },
  );
}

/**
 *
 * @param {Generator} yo
 */
module.exports = function writeFiles(yo, answers) {
  yo.log('Writing project files...');
  writeMain(yo, answers.appname);
  if (answers.features.includes('lint')) {
    yo.log('Writing Linting files...');
    writeLint(yo);
  }

  writeSrc(yo, answers.features, answers.sample);

  yo.config.set('features', answers.features);

  yo.log('Finished writing files.');
};
