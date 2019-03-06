const Generator = require('yeoman-generator');
const middleware = require('../../util/middleware');
const middlewareList = require('../../util/middlewareList');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.sourceRoot(this.templatePath('../../../templates'));

    this.option('list');


    this.currentMiddleware = [];
    this.answers = {};
  }

  async prompting() {
    if (!this.options.list) {
      const currentMiddleware = middleware.getAddedMiddleware(this) || [];

      const choices = middlewareList.map(mw => ({
        name: mw.name,
        value: mw.fileName,
        checked: currentMiddleware.includes(mw.fileName),
      }));


      const answers = await this.prompt([
        {
          type: 'checkbox',
          name: 'middleware',
          message: 'Select which middleware should be active',
          choices,
        },
      ]);

      this.currentMiddleware = currentMiddleware;
      this.answers = answers;
    } else {
      this.log('Available Middleware:\n');
      middlewareList.forEach((mw) => {
        this.log(`\t${mw.name}`);
        this.log(`\t${mw.description}`);
        if (mw.dependencies.length > 0) {
          this.log('\tRequired Features:');
          mw.dependencies.forEach((dep) => {
            this.log(`\t - ${dep}`);
          });
        }
        this.log('');
      });
    }
  }

  writing() {
    if (!this.options.list) {
      const { currentMiddleware } = this;
      const newMiddleware = this.answers.middleware;

      const middlewareToAdd = [];
      const middlewareToRemove = [];

      newMiddleware.forEach((mw) => {
        if (!currentMiddleware.includes(mw)) {
          middlewareToAdd.push(mw);
        }
      });

      currentMiddleware.forEach((mw) => {
        if (!newMiddleware.includes(mw)) {
          middlewareToRemove.push(mw);
        }
      });

      middlewareToAdd.forEach((mw) => {
        if (!middlewareList.get(mw).addMiddleware(this)) {
          newMiddleware.splice(newMiddleware.findIndex(nm => nm === mw), 1);
        }
      });

      middlewareToRemove.forEach((mw) => {
        middlewareList.get(mw).removeMiddleware(this);
      });

      this.config.set('middleware', newMiddleware);
    }
  }

  end() {
    if (!this.options.list) {
      this.log('All done!');
    }
  }
};
