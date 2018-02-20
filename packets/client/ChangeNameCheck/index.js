const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const players = require('../../../protocol/players')

module.exports.code = 14600

module.exports.decode = payload => ByteBuffer.fromBinary(payload).readIString()

module.exports.callback = players.changeNameCheck