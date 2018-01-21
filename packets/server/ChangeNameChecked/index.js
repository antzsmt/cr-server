const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 20300

module.exports.encode = name => {
    let buffer = ByteBuffer.allocate(25)
    buffer.writeByte(0)
    buffer.writeInt32(0)
    buffer.writeIString(name)

    return buffer.buffer.slice(0, buffer.offset)
}