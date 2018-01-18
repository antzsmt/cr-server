const Redis = require('../../../services/redis')
const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const clanStatus = require('../../../logic/clans/status.json')
const clanEventHandler = require('../../server/ClanEvent/newEventHandler')

module.exports.code = 14305

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}
    json.id = buffer.readInt64()
    json.tag = tag2id.id2tag(json.id.high, json.id.low)

    return json
}

module.exports.callback = async (session, data) => {
    if (session.user.clan.tag) return false // ALREADY IN A CLAN

    let clan = await db.controllers.clan.findByTag(data.tag)

    // FILTERS
    if (clan.info.access !== clanStatus.OPEN) return false
    if (clan.info.requiredTrophies > session.user.stats.trophies) return false
    if (clan.memberCount === 50) return false

    db.controllers.clan.addMember(clan, session.user)
    db.controllers.user.joinClan(session.user, clan)

    Redis.publisher.publish('clan:' + data.tag, `joined:${session.user.tag}:${session.user.nick}`)
    session.redis = new Redis.client(config.redis.port, config.redis.host)
    session.redis.subscribe('clan:' + data.tag)
    session.redis.on('message', (channel, message) => clanEventHandler.call({}, session, channel, message))

    session.send(packets.ServerCommands.code, packets.ServerCommands.encode(null, {
        id: 206,
        params: {
            id: data.id,
            name: clan.name,
            badge: clan.info.badge
        }
    }))
    session.send(packets.ClanChat.code, packets.ClanChat.encode(clan.chat, data.id))
}