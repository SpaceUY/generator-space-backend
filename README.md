# Space Backend
The following is a [yeoman](https://yeoman.io/) generator for a typescript backend, providing debugging and linting straight from [Peritus-TS](https://github.com/SpaceUY/peritus-ts-project-template).

## Quick Start
1. Install **yeoman** if it isn't already installed:  
```bash
npm install -g yo
```
2. Install **generator-space-backend**:
```bash
npm install -g @space-uy/generator-space-backend
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

### Current Version: *2 (Keystone)*
Available features and backend structure may vary between different versions, so it's recommended to keep a copy of this readme in your project for future reference. If you intend on providing a readme specific to your project, feel free to rename this file to something like *space-backend.md*.

## Features
Individual capabilities your backend can have are separated into *features*. By default, [express](https://expressjs.com/) is built-in since you wouldn't really have a backend without it (As such, it isn't considered a *feature*, but rather a core component to the backend).  
  
For the current version, the available features are:

- **[Typegoose](https://github.com/szokodiakos/typegoose):** A typescript layer of [Mongoose](https://mongoosejs.com/). (**Note:** This feature will require you to include a uri to a MongoDB database as `DB_URI` in the .env file)
- **[TypeGraphQL](https://19majkel94.github.io/type-graphql/):** A typescript layer of [GraphQL](https://graphql.org/).
- **PassportJS:** This feature is used for handling authentication. By default, it comes with [PassportJS](http://www.passportjs.org/)'s Local Strategy

A List of available features can be accessed through the command: `yo space-backend:features --list`  
Add and remove features by calling: `yo space-backend:features --force` (--force skips overwrite confirmations)  

## Middleware
These can be added to express endpoints to provide intermittent functionality.

For the current version, the available middleware are:

- **Requires:** Checks that a request contains the specified queries, params and body
- **WithAuth:** Requires that a requester be authenticated in order to access an endpoint

A List of available middleware can be accessed through the command: `yo space-backend:middleware --list`  
Add and remove middleware by calling `yo space-backend:middleware --force` (--force skips overwrite confirmations)  
