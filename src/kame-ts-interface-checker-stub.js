const hasOwnProperty = Object.prototype.hasOwnProperty;

const noop = () => {};

module.exports = {
  union: noop,
  lit: noop,
  iface: noop,
  array: noop,
  opt: noop,

  createCheckers(inputs) {
    const checkers = {};

    for (let key in inputs) {
      if (hasOwnProperty.call(inputs, key)) {
        checkers[key] = {
          check() {},
          strictCheck() {},
        };
      }
    }

    return checkers;
  },
};
