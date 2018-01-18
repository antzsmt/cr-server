const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 22952

module.exports.encode = (data) => {
    let buffer = ByteBuffer.allocate(500)
    buffer.writeByte(data.type)
    buffer.writeRrsInt32(data.tagId.high)
    buffer.writeRrsInt32(data.tagId.low)
    buffer.writeByte(data.unk)
    buffer.writeRrsInt32(data.tick)
    buffer.writeByte(data.unk2)
    buffer.writeByte(data.unk3)
    buffer.writeByte(data.unk4)

    return buffer.buffer.slice(0, buffer.offset)
}