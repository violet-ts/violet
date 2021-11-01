const withTM = require('next-transpile-modules')(['@violet/api'])

module.exports = withTM({
  env: {
    API_ORIGIN: process.env.API_ORIGIN,
    API_BASE_PATH: process.env.API_BASE_PATH,
  },
  pageExtensions: ['page.tsx'],
})
