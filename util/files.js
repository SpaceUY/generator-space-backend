// eslint-disable-next-line no-unused-vars
const Generator = require('yeoman-generator');

/**
 *
 * @param {Generator} yo
 * @param {string} path
 * @param {*} tpl
 */
function addFile(yo, path, tpl = undefined) {
  if (tpl !== undefined) {
    yo.fs.copyTpl(
      yo.templatePath(path),
      yo.destinationPath(path),
      tpl,
    );
  } else {
    yo.fs.copy(
      yo.templatePath(path),
      yo.destinationPath(path),
    );
  }
}

/**
 *
 * @param {Generator} yo
 * @param {string[]} paths
 */
function addFiles(yo, paths) {
  paths.forEach(path => addFile(yo, path));
}

/**
 *
 * @param {Generator} yo
 * @param {string} path
 */
function addFolder(yo, path) {
  yo.fs.copy(
    yo.templatePath(`${path}${path.endsWith('/') ? '' : '/'}**`),
    yo.destinationPath(path),
  );
}

/**
 *
 * @param {Generator} yo
 * @param {string[]} paths
 */
function addFolders(yo, paths) {
  paths.forEach(path => addFolder(yo, path));
}

/**
 *
 * @param {Generator} yo
 * @param {string} path
 */
function removeFile(yo, path) {
  yo.fs.delete(yo.destinationPath(path));
}

/**
 *
 * @param {Generator} yo
 * @param {string} path
 */
function removeFolder(yo, path) {
  yo.fs.delete(yo.destinationPath(path));
}

module.exports = {
  addFile,
  addFiles,
  addFolder,
  addFolders,
  removeFile,
  removeFolder,
};
