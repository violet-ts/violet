const withTM = require('next-transpile-modules')(['@violet/api'])

const { NODE_ENV } = process.env

module.exports = withTM({
  env: {
    IS_PRODUCTION: NODE_ENV === 'production',
  },
  pageExtensions: ['page.tsx'],
})
