const Generator = require('yeoman-generator');
const inquirer = require('inquirer');
const writeFiles = require('./writeFiles');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.sourceRoot(this.templatePath('../../../templates'));

    this.argument('appname', { type: String, required: false, default: undefined });

    this.answers = {};
  }

  async prompting() {
    const questions = [];

    if (!this.options.appname) {
      questions.unshift({
        type: 'input',
        name: 'appname',
        message: 'What\'s the Project\'s name?',
        default: this.appname.replace(RegExp(' ', 'g'), '-'),
      });
    }

    const answers = await this.prompt(questions);
    this.answers = answers;
    if (this.options.appname) {
      answers.appname = this.options.appname;
    }

    this.log(answers);
  }

  writing() {
    writeFiles(this, this.answers);
  }

  install() {
    this.log('Installing dependencies...');
    this.npmInstall();
  }

  end() {
    this.log('All done!');
  }
};
