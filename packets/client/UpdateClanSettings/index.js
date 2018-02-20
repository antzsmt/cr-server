const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const clans = require('../../../protocol/clans')

module.exports.code = 14316

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    json.description = buffer.readIString()
    buffer.readByte() // SCID BADGES
    json.badge = buffer.readRrsInt32()
    json.access = buffer.readByte()
    json.requiredTrophies = buffer.readRrsInt32()
    buffer.readByte() // SCID REGIONS
    json.region = buffer.readRrsInt32()

    return json
}

module.exports.callback = clans.updateSettings