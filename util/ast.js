/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const { Linter, Configuration } = require('tslint');

function isFeaturesArray(node) {
  return ts.isVariableDeclarationList(node)
    && node.declarations
    && node.declarations[0]
    && node.declarations[0].name
    && node.declarations[0].name.getText() === 'features';
}

function isImportWithName(statement, name) {
  return ts.isImportDeclaration(statement)
    && statement.importClause
    && statement.importClause.name
    && statement.importClause.name.getText() === name;
}

/**
 *
 * @param {string} name
 */
function createImport(name) {
  return ts.createImportDeclaration(
    undefined, undefined, ts.createImportClause(
      ts.createIdentifier(name), undefined,
    ), ts.createStringLiteral(`./${name}`),
  );
}

function transformAddToFeatureArray(feature) {
  return context => (rootNode) => {
    function visit(node) {
      node = ts.visitEachChild(node, visit, context);

      if (isFeaturesArray(node)) {
        node.declarations[0].initializer.elements = node.declarations[0].initializer.elements
          .concat(ts.createIdentifier(feature));
        node.declarations[0].initializer.elements.hasTrailingComma = true;
      }

      return node;
    }
    return ts.visitNode(rootNode, visit);
  };
}

function transformRemoveFromFeatureArray(feature) {
  return context => (rootNode) => {
    function visit(node) {
      node = ts.visitEachChild(node, visit, context);

      if (isFeaturesArray(node)) {
        const index = node.declarations[0].initializer.elements
          .findIndex(n => n.getText() === feature);
        node.declarations[0].initializer.elements.splice(index, 1);
        node.declarations[0].initializer.elements.hasTrailingComma = true;
      }

      return node;
    }
    return ts.visitNode(rootNode, visit);
  };
}

/**
 *
 * @param {ts.SourceFile} sourceFile
 * @param {ts.TransformerFactory[]} transforms
 */
function applyTransforms(sourceFile, transforms) {
  return ts.transform(sourceFile, transforms).transformed[0];
}

/**
 *
 * @param {ts.SourceFile} sourceFile
 * @param {string} feature
 */
function addFeature(sourceFile, feature) {
  sourceFile = applyTransforms(sourceFile, [transformAddToFeatureArray(feature)]);

  const newImport = createImport(feature);
  for (let i = 0; i < sourceFile.statements.length; i++) {
    const statement = sourceFile.statements[i];

    if (!ts.isImportDeclaration(statement)) {
      const end = sourceFile.statements.slice(i);
      sourceFile.statements = sourceFile.statements.slice(0, i).concat(newImport, end);
      break;
    }
  }
  return sourceFile;
}

/**
 *
 * @param {ts.SourceFile} sourceFile
 * @param {string} feature
 */
function removeFeature(sourceFile, feature) {
  sourceFile = applyTransforms(sourceFile, [transformRemoveFromFeatureArray(feature)]);

  for (let i = 0; i < sourceFile.statements.length; i++) {
    const statement = sourceFile.statements[i];
    if (isImportWithName(statement, feature)) {
      sourceFile.statements.splice(i, 1);
      break;
    }
  }
  return sourceFile;
}

/**
 *
 * @param {string} fullPath
 */
function readFile(fullPath) {
  const source = fs.readFileSync(fullPath, 'utf8');
  return ts.createSourceFile(
    path.basename(fullPath), source, ts.ScriptTarget.ES2017, true, ts.ScriptKind.TS,
  );
}

/**
 *
 * @param {string} fullPath
 * @param {ts.SourceFile} sourceFile
 */
function writeFile(fullPath, lintPath, sourceFile) {
  const file = ts.createPrinter().printFile(sourceFile);

  const options = {
    fix: true,
  };

  const lint = new Linter(options);
  const config = Configuration.findConfiguration(lintPath, fullPath).results;
  lint.lint(fullPath, file, config);

  const updatedSource = fs.readFileSync(fullPath, 'utf8');
  lint.lint(fullPath, updatedSource, config);
}

module.exports = {
  addFeature,
  removeFeature,
  readFile,
  writeFile,
};
