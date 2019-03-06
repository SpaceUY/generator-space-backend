const { src, dest, series } = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

const fs = require('fs');
const path = require('path');

function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function (entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}

function transpile() {
  rimraf('build');
  return src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(dest('build'));
}

function copyFile() {
  return src(['src/**/*', '!src/**/*.ts'])
    .pipe(dest('build'));
}

exports.default = series(transpile, copyFile);