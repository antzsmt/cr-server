const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const clanRoles = require('../../../logic/clans/roles.json')
const allowedRequiredTrophies = require('../../../logic/clans/requiredTrophies.json')

module.exports.code = 14316

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    json.description = buffer.readIString()
    buffer.readByte() // SCID BADGES
    json.badge = buffer.readRrsInt32()
    json.access = buffer.readByte()
    json.requiredTrophies = buffer.readRrsInt32()
    buffer.readByte() // SCID REGIONS
    json.region = buffer.readRrsInt32()
    console.log(json)
    return json
}

module.exports.callback = (session, settings) => {
    if(session.user.clan.role !== clanRoles.leader && session.user.clan.role !== clanRoles.coleader) return false
    if(settings.description.length > 95) return false
    if(settings.region > 260) return false // TO DO
    if(allowedRequiredTrophies.indexOf(settings.requiredTrophies) === -1) return false
    if(settings.badge > 179) return false // TO DO
    if(!settings.access || settings.access > 3) return false

    db.controllers.clan.updateSettings(session.user.clan.tag, settings)
}