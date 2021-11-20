/* eslint-disable @typescript-eslint/no-var-requires */
require('source-map-support').install()
require('dotenv').config({
  path: require('path').resolve(__dirname, '..', '..', '..', '.env'),
})
require('./index/main')
/* eslint-enable @typescript-eslint/no-var-requires */
