const mongoose = require('mongoose')
require('dotenv').config()

const uriDB = process.env.URI_DB

const db = mongoose.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection to DB')
})

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error ${err.message}`)
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('Connection to DB closed')
  process.exit()
})

module.exports = db