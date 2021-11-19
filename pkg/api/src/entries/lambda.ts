/* eslint-disable @typescript-eslint/no-var-requires */
require('source-map-support').install()
require('dotenv').config({
  path: require('path').resolve(__dirname, '..', '..', '..', '.env'),
})
require('./lambda/main')
/* eslint-enable @typescript-eslint/no-var-requires */
