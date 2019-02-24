// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');

const files = require('./files');
const features = require('./features');

class Middleware {
  /**
   *
   * @param {string} name
   * @param {string} description
   * @param {string} fileName
   * @param {string[]} dependencies
   * @param {object} options
   */
  constructor(name, description, fileName, dependencies = [], options = {}) {
    this.name = name;
    this.description = description;
    this.fileName = fileName;
    this.dependencies = dependencies;
    this.options = options;
  }

  /**
   *
   * @param {Generator} yo
   * @returns {boolean}
   */
  addMiddleware(yo) {
    const state = this.dependenciesAvailable(yo);

    if (!state.available) {
      yo.log(`[ERROR] - Missing Features for ${this.name}:`);
      state.missingDeps.forEach((dep) => {
        yo.log(` - ${dep}`);
      });
      return false;
    }

    files.addFile(
      yo,
      `src/middleware/${this.fileName}.ts`,
    );

    return true;
  }

  /**
   *
   * @param {Generator} yo
   */
  removeMiddleware(yo) {
    files.removeFile(
      yo,
      `src/middleware/${this.fileName}.ts`,
    );
  }

  /**
   * @param {Generator} yo
   * @returns {{available: boolean, missingDeps?: string[]}}
   */
  dependenciesAvailable(yo) {
    const addedFeatures = features.getAddedFeatures(yo);
    const missingDeps = [];
    this.dependencies.forEach((dep) => {
      if (!addedFeatures.includes(dep)) {
        missingDeps.push(dep);
      }
    });

    if (missingDeps.length > 0) {
      return {
        available: false,
        missingDeps,
      };
    }
    return {
      available: true,
    };
  }
}

/**
 *
 * @param {Generator} yo
 */
function getAddedMiddleware(yo) {
  return yo.config.get('middleware');
}

module.exports = {
  Middleware,
  getAddedMiddleware,
};
