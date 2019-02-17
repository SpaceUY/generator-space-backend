/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const ts = require('typescript');

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

module.exports = {
  addFeature,
  removeFeature,
};
