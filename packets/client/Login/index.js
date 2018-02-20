const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const players = require('../../../protocol/players')

module.exports.code = 10101

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    json.id = {
        high: buffer.readInt32(),
        low: buffer.readInt32()
    }
    json.tag = tag2id.id2tag(json.id.high, json.id.low)

    json.pass = buffer.readIString()

    buffer.readRrsInt32()
    buffer.readRrsInt32()
    buffer.readRrsInt32()

    json.resourceSha = buffer.readIString()

    return json
}

module.exports.callback = players.auth
