const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const clans = require('../../../protocol/clans')

module.exports.code = 14302

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    
    return tag2id.id2tag(buffer.readInt32(), buffer.readInt32())
}

module.exports.callback = clans.fetch
