const withTM = require('next-transpile-modules')(['@violet/api'])

module.exports = withTM({
  env: {},
  pageExtensions: ['page.tsx'],
})
