/* eslint-disable @typescript-eslint/no-var-requires -- entrypoint */
require('source-map-support').install()
require('dotenv').config({
  path: require('path').resolve(__dirname, '..', '..', '..', '.env') as string,
})
module.exports = require('./lambda/main')
