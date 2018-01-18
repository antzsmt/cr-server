const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const events = require('../../../logic/clans/entriesIds.json')
const Redis = require('../../../services/redis')

module.exports.code = 14308

module.exports.callback = async (session, data) => {
    if (!session.user.clan.tag) return false // NOT IN A CLAN

    let clan = await db.controllers.clan.findByTag(session.user.clan.tag)

    await session.redis.disconnect()
    Redis.publisher.publish('clan:' + session.user.clan.tag, `left:${session.user.tag}:${session.user.nick}`)

    db.controllers.clan.removeMember(clan, session.user)
    db.controllers.user.leaveClan(session.user)

    session.send(packets.ServerCommands.code, packets.ServerCommands.encode(null, {
        id: 205,
        params: {
            id: clan.tagId,
        }
    }))
}