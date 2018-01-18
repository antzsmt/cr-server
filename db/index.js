const fs = require('fs')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

mongoose.connect(`mongodb://${config.db.host}/${config.db.name}`, {
    useMongoClient: true
})

mongoose.connection.on('error', () => {
    console.error('✖️  Could not connect to database')
    process.exit(1)
})

mongoose.connection.once('connected', () => {
    console.log('✔️  Successfully connected to the DB')
})


db = {}
// TODO: AUTO LOAD
db.models = {
    User: require('./models/User'),
    Clan: require('./models/Clan')
}

db.controllers = {
    user: require('./controllers/user'),
    clan: require('./controllers/clan')
}