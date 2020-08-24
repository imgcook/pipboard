const { eslint } = require('@ice/spec');

eslint.rules['no-undef'] = 'off';
eslint.rules['no-nested-ternary'] = 'off';
eslint.rules['react/no-string-refs'] = 'off';
eslint.rules['react/jsx-no-bind'] = 'off';
eslint.rules['import/no-dynamic-require'] = 'off';

module.exports = eslint;
