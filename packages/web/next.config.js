const withTM = require('next-transpile-modules')(['@violet/api'])

module.exports = withTM({
  pageExtensions: ['page.tsx'],
})
