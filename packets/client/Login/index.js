const Redis = require('../../../services/redis')
const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const clanEventHandler = require('../../server/ClanEvent/newEventHandler')
const events = require('../../../logic/clans/entriesIds.json')

module.exports.code = 10101

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    json.id = {
        high: buffer.readInt32(),
        low: buffer.readInt32()
    }
    json.tag = tag2id.id2tag(json.id.high, json.id.low)

    json.pass = buffer.readIString()

    buffer.readRrsInt32()
    buffer.readRrsInt32()
    buffer.readRrsInt32()

    json.resourceSha = buffer.readIString()

    return json
}

module.exports.callback = async (session, json) => {
    let user = json.pass ? await db.controllers.user.find({
        tag: json.tag,
        pass: json.pass
    }) : await db.controllers.user.create()
    if (user) {
        session.user = user
        session.send(packets.LoginOk.code, packets.LoginOk.encode(user))
        session.send(packets.AccountInfo.code, packets.AccountInfo.encode(user))
        clients[user.tag] = session
        if (user.clan.tag) {
            let clan = await db.controllers.clan.getChat(user.clan.tag)
            session.send(packets.ClanChat.code, packets.ClanChat.encode(clan.chat))

            session.redis = new Redis.client(config.redis.port, config.redis.host)
            session.redis.subscribe('clan:' + user.clan.tag)
            session.redis.on('message', (channel, message) => clanEventHandler.call({}, session, channel, message))
        }
    } else {
        session.send(packets.LoginFailed.code, packets.LoginFailed.encode('7'))
    }
}