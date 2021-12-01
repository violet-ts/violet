const withTM = require('next-transpile-modules')(['@violet/api', '@violet/def', '@violet/lib'])

module.exports = withTM({
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
})
