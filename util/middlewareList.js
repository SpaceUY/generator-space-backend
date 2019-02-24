const { Middleware } = require('./middleware');

/**
 * @typedef MiddlewareList
 * @type {Middleware[]}
 * @property {(name: string) => Middleware} get
 */

/** @type {MiddlewareList} */
const middlewareList = [
  new Middleware(
    'Requires',
    'Checks that a request contains the specified queries, params and body',
    'requires',
    [],
  ),
  new Middleware(
    'WithAuth',
    'Requires that a requester be authenticated in order to access an endpoint',
    'withAuth',
    [
      'typegoose',
    ],
  ),
];

middlewareList.get = function get(name) {
  return this.find(mw => mw.fileName === name);
};

module.exports = middlewareList;
