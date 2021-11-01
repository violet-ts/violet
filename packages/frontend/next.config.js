const isProduction = process.env.NODE_ENV === 'production'
const withNoop = (config) => config;
const withTM = isProduction ? withNoop : require('next-transpile-modules')(['@violet/api'])

module.exports = withTM({
  env: {
    IS_PRODUCTION: String(isProduction),
  },
  pageExtensions: ['page.tsx'],
})
