const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 21902

module.exports.encode = (id, events) => {
    let buffer = ByteBuffer.allocate(40)
    buffer.writeRrsInt32(id)
    buffer.writeRrsInt32(0)

    buffer.writeRrsInt32(events.length)
    for (let event of events) {
        buffer.writeRrsInt32(event.type)
        switch (event.type) {
            case 1:
                buffer.writeRrsInt32(event.tick)
                buffer.writeRrsInt32(event.tick)
                buffer.writeRrsInt32(event.userId.high)
                buffer.writeRrsInt32(event.userId.low)
                buffer.writeRrsInt32(event.deckIndex)
                buffer.writeRrsInt32(event.card.high)
                buffer.writeRrsInt32(event.card.low)
                buffer.writeByte(0)
                buffer.writeByte(1)
                buffer.writeByte(event.card.id) // CARD ID
                buffer.writeByte(0)
                buffer.writeRrsInt32(event.coords.x)
                buffer.writeRrsInt32(event.coords.y)
        }
    }

    return buffer.buffer.slice(0, buffer.offset)
}