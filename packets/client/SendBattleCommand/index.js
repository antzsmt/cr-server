const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const cards = require('../../../logic/cards')
const battles = require('../../../protocol/battles')

module.exports.code = 12904

module.exports.decode = payload => {
    console.log(Buffer.from(payload).toString('hex'))
    let json = {}
    let buf = ByteBuffer.fromBinary(payload)
    buf.readRrsInt32()
    buf.readRrsInt32() // Tick again
    json.commandCount = buf.readByte()
    json.commands = []
    try {
        for (let i = 0; i < json.commandCount; i++) {
            let command = {}
            command.type = buf.readByte()
            command.tick = buf.readRrsInt32()
            buf.readByte()
            command.userId = {
                high: buf.readRrsInt32(),
                low: buf.readRrsInt32()
            }
            command.deckIndex = buf.readByte() // Card slot ??
            command.card = {
                high: buf.readByte(),
                low: buf.readRrsInt32()
            } // SCID
            command.card.id = cards.scid[command.card.high * 1000000 + command.card.low].id
            buf.readByte()
            buf.readByte()
            command.coords = {
                x: buf.readRrsInt32(),
                y: buf.readRrsInt32()
            }
            command.deb = cards.scid[command.card.high * 1000000 + command.card.low].name
            json.commands.push(command)
        }
    } catch (e) { console.log(e) }
    console.log(json)

    return json
}

module.exports.callback = battles.command