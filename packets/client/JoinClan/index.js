const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const clans = require('../../../protocol/clans')

module.exports.code = 14305

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}
    json.id = buffer.readInt64()
    json.tag = tag2id.id2tag(json.id.high, json.id.low)

    return json
}

module.exports.callback = clans.join
