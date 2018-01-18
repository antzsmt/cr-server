const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 20104

module.exports.encode = user => {
    let buffer = ByteBuffer.allocate(300)

    buffer.writeInt32(user.tagId.high)
    buffer.writeInt32(user.tagId.low)
    buffer.writeInt32(user.tagId.high)
    buffer.writeInt32(user.tagId.low)
    buffer.writeIString(user.pass)
    buffer.writeIString('')
    buffer.writeIString('')
    buffer.writeRrsInt32(3)
    buffer.writeRrsInt32(193)
    buffer.writeRrsInt32(193)
    buffer.writeRrsInt32(14)
    buffer.writeIString('prod')
    buffer.writeRrsInt32(1)
    buffer.writeRrsInt32(0)
    buffer.writeRrsInt32(0)
    buffer.writeIString('1475268786112433')
    buffer.writeIString((Date.now() / 1000 | 0).toString())
    buffer.writeIString((Date.now() / 1000 | 0).toString())
    buffer.writeByte(0)
    buffer.writeIString('')
    buffer.writeIString('')
    buffer.writeIString('')
    buffer.writeIString('ES')
    buffer.writeIString('Paradise')
    buffer.writeIString('http://7166046b142482e67b30-2a63f4436c967aa7d355061bd0d924a1.r65.cf1.rackcdn.com')
    buffer.writeIString('https://event-assets.clashroyale.com')
    buffer.writeByte(1)

    return buffer.buffer.slice(0, buffer.offset)
}