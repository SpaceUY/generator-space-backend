// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');
const dep = require('../../util/dependencies');

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
 * Adds dependencies for Mongoose
 * @param {Generator} yo
 */
function npmMongoose(yo) {
  dep.addDependencies(yo, ['mongoose', 'typegoose'], ['@types/mongoose']);
}

/**
 * Adds dependencies for GraphQL
 * @param {Generator} yo
 */
function npmGraphQL(yo) {
  dep.addDependencies(yo, ['express-graphql', 'type-graphql'], ['@types/express-graphql']);
}

/**
 * Adds dependencies for PassportJS
 * @param {Generator} yo
 */
function npmPassport(yo) {
  dep.addDependencies(yo, ['passport', 'passport-local'], ['@types/passport', '@types/passport-local']);
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

  yo.fs.copyTpl(
    yo.templatePath('src/models/index.ts'),
    yo.destinationPath('src/models/index.ts'),
    {
      imports,
      models,
    },
  );

  if (samples) {
    yo.fs.copy(
      yo.templatePath('src/models/definitions/**'),
      yo.destinationPath('src/models/definitions'),
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

  yo.fs.copyTpl(
    yo.templatePath('src/graph/index.ts'),
    yo.destinationPath('src/graph/index.ts'),
    {
      imports,
      resolvers,
    },
  );

  if (samples) {
    yo.fs.copy(
      yo.templatePath('src/graph/inputs/**'),
      yo.destinationPath('src/graph/inputs'),
    );
    yo.fs.copy(
      yo.templatePath('src/graph/resolvers/**'),
      yo.destinationPath('src/graph/resolvers'),
    );
    yo.fs.copy(
      yo.templatePath('src/graph/types/**'),
      yo.destinationPath('src/graph/types'),
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
    npmMongoose(yo);
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
    npmGraphQL(yo);
    writeGraphQL(yo, samples);

    imports += '\nimport * as ExpressGraphQL from \'express-graphql\';';
    graphImport = '\nimport graph from \'./graph\';';
    appUseGraph = 'app.use(ExpressGraphQL(graph));\n';
  }

  // passport
  if (features.includes('passport')) {
    yo.log('Writing PassportJS files...');
    npmPassport(yo);
    writePassport(yo);

    passport = '\nrequire(\'./configs/passport\');\n';
  }

  // middleware
  yo.fs.copy(
    yo.templatePath('src/middleware/**'),
    yo.destinationPath('src/middleware'),
  );

  // routes
  let routes = '';
  if (samples) {
    routes = `import auth from './auth';

app.use('/auth', auth);`;

    yo.fs.copy(
      yo.templatePath('src/routes/auth/**'),
      yo.destinationPath('src/routes/auth'),
    );
  }
  yo.fs.copyTpl(
    yo.templatePath('src/routes/index.ts'),
    yo.destinationPath('src/routes/index.ts'),
    {
      routes,
    },
  );

  yo.log('Writing index.ts...');
  yo.fs.copyTpl(
    yo.templatePath('src/index.ts'),
    yo.destinationPath('src/index.ts'),
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
