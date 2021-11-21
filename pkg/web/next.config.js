const withTM = require('next-transpile-modules')(['@violet/api', '@violet/def'])

module.exports = withTM({
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
})
