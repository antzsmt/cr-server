const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const clans = require('../../../protocol/clans')

module.exports.code = 14315

module.exports.decode = payload => {
    let buf = ByteBuffer.fromBinary(payload)

    return buf.readIString()
}

module.exports.callback = clans.chat