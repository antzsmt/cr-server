const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const battles = require('../../../protocol/battles')

module.exports.code = 12951

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}
    json.type = buffer.readByte()
    json.tagId = {
        high: buffer.readRrsInt32(),
        low: buffer.readRrsInt32()
    }
    json.unk = buffer.readByte()
    json.tick = buffer.readRrsInt32()
    json.unk2 = buffer.readByte()
    json.unk3 = buffer.readByte()
    json.unk4 = buffer.readByte()
    console.log(json)
    return json
}

module.exports.callback = battles.event