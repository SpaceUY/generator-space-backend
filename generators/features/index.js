const Generator = require('yeoman-generator');
const features = require('../../util/features');
const featuresList = require('../../util/featureList');
const ast = require('../../util/ast');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.sourceRoot(this.templatePath('../../../templates'));

    this.option('list');


    this.currentFeatures = [];
    this.answers = {};
  }

  async prompting() {
    if (!this.options.list) {
      const currentFeatures = features.getAddedFeatures(this) || [];

      const choices = featuresList.map(ft => ({
        name: ft.name,
        value: ft.fileName,
        checked: currentFeatures.includes(ft.fileName),
      }));


      const answers = await this.prompt([
        {
          type: 'checkbox',
          name: 'features',
          message: 'Select which features should be active',
          choices,
        },
      ]);

      this.currentFeatures = currentFeatures;
      this.answers = answers;
    } else {
      this.log('Available Features:\n');
      featuresList.forEach((ft) => {
        this.log(`\t${ft.name}`);
        this.log(`\t${ft.description}\n`);
      });
    }
  }

  writing() {
    if (!this.options.list) {
      const { currentFeatures } = this;
      const newFeatures = this.answers.features;

      const feautresToAdd = [];
      const feautresToRemove = [];

      newFeatures.forEach((ft) => {
        if (!currentFeatures.includes(ft)) {
          feautresToAdd.push(ft);
        }
      });

      currentFeatures.forEach((ft) => {
        if (!newFeatures.includes(ft)) {
          feautresToRemove.push(ft);
        }
      });

      let sourceFile = ast.readFile(this.destinationPath('src/features/index.ts'));

      feautresToAdd.forEach((ft) => {
        sourceFile = featuresList.get(ft).addFeature(this, sourceFile);
      });
      feautresToRemove.forEach((ft) => {
        sourceFile = featuresList.get(ft).removeFeature(this, sourceFile);
      });

      ast.writeFile(
        this.destinationPath('src/features/index.ts'),
        this.destinationPath('tslint.json'),
        sourceFile,
      );

      this.config.set('features', newFeatures);
    }
  }

  install() {
    if (!this.options.list) {
      this.log('Installing dependencies...');
      this.npmInstall();
    }
  }

  end() {
    if (!this.options.list) {
      this.log('All done!');
    }
  }
};
