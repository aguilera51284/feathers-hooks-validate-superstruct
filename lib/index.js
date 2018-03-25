const fromPairs = require('lodash.frompairs');
const errors = require('@feathersjs/errors');
const { getItems, replaceItems } = require('feathers-hooks-common');

function formatError(error) {
  const { type, path, value } = error;
  const message = `Expected a value of type \`${type}\`${
    path.length ? ` for \`${path.join('.')}\`` : ''
  } but received \`${JSON.stringify(value)}\`.`;
  return message;
}

module.exports = function validateSuperstruct(struct) {
  return ctx => {
    try {
      const value = getItems(ctx);
      const newValue = struct(value);
      replaceItems(ctx, newValue);
      return ctx;
    }
    catch(err) {
      const validationErrors = fromPairs(
        err.errors.map(err => [err.path.join('.'), formatError(err)])
      );

      throw new errors.BadRequest({ errors: validationErrors });
    }
  };
};
