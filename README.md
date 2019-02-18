# Space Backend
The following is a [yeoman](https://yeoman.io/) generator for a typescript backend, providing debugging and linting straight from [Peritus-TS](https://github.com/SpaceUY/peritus-ts-project-template).

## Quick Start
1. Install **yeoman** if it isn't already installed:  
```bash
npm install -g yo
```
2. Install **generator-space-backend**:
```bash
npm install -g "https://github.com/SpaceUY/generator-space-backend"
```
3. Create a new repository and clone locally
4. Go to local repository and run the following command:
```bash
yo space-backend
```
5. Answer the wizard's questions
6. Wait for packages to be installed...
7. Get busy coding!

**Note:** If you run the wizard in a folder that isn't a repository, [husky](https://github.com/SpaceUY/peritus-ts-project-template#husky) won't install properly.

## Powered by Peritus-TS
A lot of the development features provided by this generator are from [Peritus-TS](https://github.com/SpaceUY/peritus-ts-project-template). Take a look at the readme there if you wan't an explanation of the individual components that are available, such as debugging straight from typescript, and linting that is enforced even upon committing changes.

### Current Version: *1 (Sapling)*
Available features and backend structure may vary between different versions, so it's recommended to keep a copy of this readme in your project for future reference. If you intend on providing a readme specific to your project, feel free to rename this file to something like *space-backend.md*.

## Features
Individual capabilities your backend can have are separated into *features*. By default, [express](https://expressjs.com/) is built-in since you wouldn't really have a backend without it (As such, it isn't considered a *feature*, but rather a core component to the backend).  
  
For the current version, the available features are:

- **Code Linting (recommended):** All of the project's linting was put into its own, separate feature. The wizard will include it by default, but you can disable it if you'd rather not use linting. (But why would you do that?)
- **Mongoose:** This feature references [Typegoose](https://github.com/szokodiakos/typegoose), a typescript layer of [Mongoose](https://mongoosejs.com/). (**Note:** This feature will require you to include a uri to a MongoDB database as `DB_URI` in the .env file)
- **GraphQL:** This feature references [TypeGraphQL](https://19majkel94.github.io/type-graphql/), a typescript layer of [GraphQL](https://graphql.org/).
- **PassportJS:** This feature is used for handling authentication. By default, it comes with [PassportJS](http://www.passportjs.org/)'s Local Strategy
## Samples
Sample code is available to be included by the wizard upon creating a project for the relevant features you selected.
