const Redis = require('../services/redis')
const clanStatus = require('../logic/clans/status.json')
const clanRoles = require('../logic/clans/roles.json')
const allowedRequiredTrophies = require('../logic/clans/requiredTrophies.json')
const events = require('../logic/clans/entriesIds.json')
const clanEventHandler = require('../packets/server/ClanEvent/newEventHandler')

module.exports.join = async (session, data) => {
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


module.exports.leave = async (session, data) => {
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

module.exports.updateSettings = (session, settings) => {
    if(session.user.clan.role !== clanRoles.leader.id && session.user.clan.role !== clanRoles.coleader.id) return false
    if(settings.description.length > 95) return false
    if(settings.region > 260) return false // TO DO
    if(allowedRequiredTrophies.indexOf(settings.requiredTrophies) === -1) return false
    if(settings.badge > 179) return false // TO DO
    if(!settings.access || settings.access > 3) return false

    db.controllers.clan.updateSettings(session.user.clan.tag, settings)
}

module.exports.chat = (session, message) => {
    if (!session.user.clan.tag) return false

    Redis.publisher.publish(
        'clan:' + session.user.clan.tag,
        `msg:${session.user.tag}:${session.user.nick}:${session.user.role}:${message}`
    )
    db.controllers.clan.addMessage(message, session.user)
}

module.exports.fetch = async (session, tag) => {
    let clan = await db.controllers.clan.findByTag(tag)

    if(clan) session.send(packets.Clan.code, packets.Clan.encode(clan))
}

module.exports.searchJoinable = async session => {
    let clans = await db.controllers.clan.findJoinable()
    session.send(packets.JoinableClans.code, packets.JoinableClans.encode(clans))
}

module.exports.changeRole = async (session, json) => {
    let avaiableRoles = Object.values(clanRoles).map(role => role.id)
    let user = await db.controllers.user.find({tag: json.tag})

    if(!user) return false
    if(avaiableRoles.indexOf(json.role) === -1) return false // Role doesn't exists
    if(clanRoles[clanRoles[json.role]].order >= clanRoles[clanRoles[session.user.clan.role]].order) return false
    if(clanRoles[clanRoles[user.clan.role]].order >= clanRoles[clanRoles[session.user.clan.role]].order) return false
    if(!session.user.clan || !user.clan) return false
    // todo: promote to leader

    let promoted = clanRoles[clanRoles[json.role]].order > clanRoles[clanRoles[user.clan.role]].order

    db.controllers.user.changeRole(user, json.role)
    db.controllers.clan.changeRole(session.user.clan.tag, user, json.role, promoted, session.user) 
    Redis.publisher.publish(
        'clan:' + session.user.clan.tag,
        `${promoted ? 'promoted' : 'demoted'}:${user.tag}:${user.nick}:${session.user.nick}`
    )
}