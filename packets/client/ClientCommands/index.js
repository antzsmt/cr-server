const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const handlers = {
    500: require('./handlers/changeDeckCard'),
    501: require('./handlers/selectDeck'),
    503: require('./handlers/openChest'),
    504: require('./handlers/upgradeCard'),
    516: require('./handlers/openChest'),
    517: require('./handlers/buyShopGold'),
    548: require('./handlers/startBattle')
}
const commands = {}
const commandsIds = {
    500: 'changeCard',
    501: 'selectDeck',
    503: 'openHomeChest',
    504: 'upgradeCard',
    516: 'openShopChest',
    517: 'buyShopGold',
    548: 'startBattle',
    557: 'unknown'
}

module.exports.code = 14102
module.exports.decode = payload => {
    console.log(Buffer.from(payload).toString('hex'))
    let json = {}
    let buf = ByteBuffer.fromBinary(payload)
    buf.readRrsInt32() // TICK
    json.checksum = buf.readRrsInt32() // CHECKSUM
    let cmdCount = buf.readRrsInt32()
    json.commands = []

    for (let i = 0; i < cmdCount; i++) {
        let cmdId = buf.readRrsInt32()
        let action = commandsIds[cmdId]
        if (typeof commands[action] == 'function')
            json.commands.push({ id: cmdId, params: commands[action](buf) })
    }

    return json
}

module.exports.callback = (session, json) => {
    json.commands.forEach(cmd => {
        if (handlers[cmd.id]) handlers[cmd.id](session, cmd)
    })
}

commands.openHomeChest = buf => {
    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32()
    buf.readRrsInt32()

    return { chestId: buf.readRrsInt32() }
}

commands.openShopChest = buf => {
    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32() // 19 (SCID CHESTS)

    return { chestId: buf.readRrsInt32() }
}

commands.buyShopGold = buf => {
    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32() // 37 (SCID)

    return { pack: buf.readRrsInt32() }
}

commands.upgradeCard = buf => {
    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32()
    buf.readRrsInt32()

    let hi = buf.readRrsInt32()
    let lo = buf.readRrsInt32()

    return { card: hi * 0xF4240 + lo }
}

commands.selectDeck = buf => {
    buf.readRrsInt32()
    buf.readRrsInt32()

    buf.readRrsInt32()
    buf.readRrsInt32()

    return { deck: buf.readByte() }
}
commands.changeCard = buf => {
    buf.readRrsInt32() // TICK
    buf.readRrsInt32() // TICK

    buf.readRrsInt32() // ID HIGH
    buf.readRrsInt32() // LOW

   return { card: buf.readRrsInt32(), slot: buf.readByte() }
}

commands.unknown = buf => {
    buf.readByte()
    buf.readByte()
    buf.readByte()
    buf.readRrsInt32()
    buf.readByte()
    buf.readByte()

    return false
}

commands.startBattle = () => {
    return true
}