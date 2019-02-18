// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');
// eslint-disable-next-line no-unused-vars
const ts = require('typescript');

const files = require('./files');
const dep = require('./dependencies');
const ast = require('./ast');

class Feature {
  /**
   *
   * @param {string} name
   * @param {string} description
   * @param {string} fileName
   * @param {string[]} dependencies
   * @param {string[]} devDependencies
   * @param {object} options
   * @param {string[]=} options.featureFolderPaths
   * @param {string[]=} options.featureFilePaths
   */
  constructor(name, description, fileName, dependencies, devDependencies, options = {}) {
    this.name = name;
    this.description = description;
    this.fileName = fileName;
    this.dependencies = dependencies;
    this.devDependencies = devDependencies;
    this.options = options;
  }

  /**
   *
   * @param {Generator} yo
   * @param {ts.SourceFile} sourceFile
   */
  addFeature(yo, sourceFile) {
    files.addFile(
      yo,
      `src/features/${this.fileName}.ts`,
    );
    dep.addDependencies(
      yo,
      this.dependencies,
      this.devDependencies,
    );
    return ast.addFeature(sourceFile, this.fileName);
  }

  /**
   *
   * @param {Generator} yo
   * @param {ts.SourceFile} sourceFile
   */
  removeFeature(yo, sourceFile) {
    files.removeFile(
      yo,
      `src/features/${this.fileName}.ts`,
    );
    dep.removeDependencies(
      yo,
      this.dependencies.concat(this.devDependencies),
    );
    return ast.removeFeature(sourceFile, this.fileName);
  }
}

/**
 *
 * @param {Generator} yo
 */
function getAddedFeatures(yo) {
  return yo.config.get('features');
}

module.exports = {
  Feature,
  getAddedFeatures,
};
