require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') })

module.exports = {
  input: 'api',
  baseURL: `${process.env.API_ORIGIN || ''}${process.env.BASE_PATH || ''}`,
}
