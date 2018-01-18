const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 24117

module.exports.encode = request => {
    let buffer = ByteBuffer.allocate(8)
    buffer.writeInt32(request.high)
    buffer.writeInt32(request.low)

    return buffer.buffer
}