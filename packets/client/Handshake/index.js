const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const version = require('../../../protocol/version')

module.exports.code = 10100

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    buffer.readInt32()
    buffer.readInt32()
    buffer.readInt32()
    buffer.readInt32()
    buffer.readInt32()
    json.resourceSha = buffer.readIString()
    buffer.readInt32()
    buffer.readInt32()

    return json
}

module.exports.callback = version.updateContent
