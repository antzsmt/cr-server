
const tag2id = require('../../logic/utils/tag2id')
const events = require('../../logic/clans/entriesIds.json')

const generateTag = () => {
    let id = Math.floor((Math.random() * 100000000) + 256) // VERY UNSECURE
    return tag2id.lid2tag(id)
}

const timestamp = () => Date.now() / 1000 | 0

module.exports.create = async () => {
    let user = new db.models.Clan({ tag: generateTag() })
    await user.save()

    return user
}

module.exports.findJoinable = async () => db.models.Clan.find({ "info.access": 1, memberCount: { $lt: 50 } })
    .sort({ 'date': -1 })
    .limit(10)
    .exec()

module.exports.findByTag = async tag => db.models.Clan.findOne({ tag: tag })

module.exports.findBasicInfo = async tag => db.models.Clan.findOne({ tag: tag })
    .select({ "info.name": 1, "info.badge": 1 })
    .exec()


module.exports.top = async () => db.models.Clan.find()
    .sort({ 'info.trophies': -1 })
    .limit(200)
    .exec()

module.exports.getChat = async tag => db.models.Clan.findOne({ tag: tag })
    .select('chat')
    .exec()

module.exports.addMember = async (clan, member) => {
    clan.memberCount += 1
    clan.members[member.tag] = [member.nick, member.stats.trophies, 0, 1, member.stats.level]
    clan.markModified('members')
    clan.chat.push([events.MEMBER_ACTION.code, events.MEMBER_ACTION.JOINED, member.nick, timestamp()])
    if (clan.chat.length > 50) clan.chat = clan.chat.slice(1)
    // TODO: Recalcular trophies

    clan.save()
}

module.exports.removeMember = async (clan, member) => {
    clan.memberCount -= 1
    delete clan.members[member.tag]
    clan.markModified('members')
    clan.chat.push([events.MEMBER_ACTION.code, events.MEMBER_ACTION.LEFT, member.tag, member.nick, timestamp()])
    if (clan.chat.length > 50) clan.chat = clan.chat.slice(1)
    // TODO: Recalcular trophies

    clan.save()
}

module.exports.addMessage = async (message, member) => {
    let clan = await db.controllers.clan.findByTag(member.clan.tag)
    clan.chat.push([events.MESSAGE, member.tag, message, member.nick, clan.members[member.tag][3], timestamp()])
    if (clan.chat.length > 50) clan.chat = clan.chat.slice(1)

    clan.save()
}

module.exports.updateSettings = async (tag, settings) => {
    let clan = await db.controllers.clan.findByTag(tag)
    clan.info.description = settings.description
    clan.info.badge = settings.badge
    clan.info.region = settings.region
    clan.info.access = settings.access
    clan.info.requiredTrophies = settings.requiredTrophies

    clan.save()
}

module.exports.changeRole = async (tag, member, role, promoted, initiator) => {
    let clan = await db.controllers.clan.findByTag(tag)

    clan.members[member.tag][3] = role
    clan.markModified('members')
    clan.chat.push([events.MEMBER_ACTION.code, promoted ? events.MEMBER_ACTION.PROMOTED : events.MEMBER_ACTION.DEMOTED, member.tag, member.nick, timestamp(), initiator.nick])
    if (clan.chat.length > 50) clan.chat = clan.chat.slice(1)

    clan.save()
}