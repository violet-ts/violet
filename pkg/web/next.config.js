const withTM = require('next-transpile-modules')(['@violet/api', '@violet/def'])

module.exports = withTM({
  pageExtensions: ['page.tsx'],
})
