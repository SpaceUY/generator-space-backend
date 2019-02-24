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
    if (this.options.featureFilePaths && this.options.featureFilePaths.length) {
      files.addFiles(
        yo,
        this.options.featureFilePaths,
      );
    }
    if (this.options.featureFolderPaths && this.options.featureFolderPaths.length) {
      files.addFolders(
        yo,
        this.options.featureFolderPaths,
      );
    }
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
    if (this.options.featureFilePaths && this.options.featureFilePaths.length) {
      files.removeFiles(
        yo,
        this.options.featureFilePaths,
      );
    }
    if (this.options.featureFolderPaths && this.options.featureFolderPaths.length) {
      files.removeFolders(
        yo,
        this.options.featureFolderPaths,
      );
    }
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
 * @returns {string[]}
 */
function getAddedFeatures(yo) {
  return yo.config.get('features');
}

module.exports = {
  Feature,
  getAddedFeatures,
};
