const express = require('express')
const morgan = require('morgan')
const chalk = require('chalk')
const app = express()

app.use(morgan('dev'))

app.use('/' + config.content.sha, express.static('./services/http/files'))

app.listen(8080, () => console.log('[SERVER]', chalk.green('HTTP content server listening on port 8080')))