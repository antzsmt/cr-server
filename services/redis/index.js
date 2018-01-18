const Redis = require('ioredis')
const chalk = require('chalk')

module.exports.publisher = new Redis(config.redis.port, config.redis.host)

module.exports.client = Redis

console.log('[SERVER]', chalk.green('Redis service running'))