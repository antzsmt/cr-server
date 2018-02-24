const Redis = require('../services/redis')
const clanEventHandler = require('../packets/server/ClanEvent/newEventHandler')
const fingerprintSha = require('../services/http/fingerprint').sha

module.exports.auth = async (session, json) => {
    if (json.resourceSha != fingerprintSha) {
        session.send(packets.LoginFailed.code, packets.LoginFailed.encode('updateContent'), 4)
    } else {
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
            session.send(packets.LoginFailed.code, packets.LoginFailed.encode('7')) // TODO
        }
    }
}

module.exports.fetch = async (session, json) => {
    let user = await db.controllers.user.find({tag: json.tag})
    if(user)
        session.send(packets.Profile.code, packets.Profile.encode(user))
    else
        session.send(packets.ProfileNotExists.code, packets.ProfileNotExists.encode(json.id))
}

module.exports.changeName = async (session, name) => {
    db.controllers.user.changeNick(session.user, name)
    session.send(packets.ServerCommands.code, packets.ServerCommands.encode(null, { id: 201, params: { name: name } }))
}

module.exports.changeNameCheck = (session, name) => {
    session.send(packets.ChangeNameChecked.code, packets.ChangeNameChecked.encode(name)) // TODO
}
