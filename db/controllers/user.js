const tag2id = require('../../logic/utils/tag2id')
const levels = require('../../logic/levels.json')
const clanRoles = require('../../logic/clans/roles.json')

/** UGLY SOLUTION */
var userCount = 0;
(async function () {
    userCount = await db.models.User.count()
})()
const generateTag = () => {
    let id = userCount + 256
    userCount += 1
    return tag2id.lid2tag(id)
}
const passCharset = '0123456789abcdefghijklmnopqrstuvwxyz' // We don't need to create it everytime
const generatePass = () => {
    let token = ''
    for (let i = 0; i < 40; i++) {
        token += passCharset.charAt(Math.floor(Math.random() * passCharset.length))
    }
    return token
}

module.exports.find = async user => db.models.User.findOne(user)

module.exports.create = async () => {
    let user = new db.models.User({ tag: generateTag(), pass: generatePass() })
    await user.save()

    return user
}

module.exports.addRewards = (session, chest, rewards) => {
    // Remove chest
    if (chest) {
        session.user.chests.splice(session.user.chests.indexOf(chest), 1)
        session.user.markModified('chests')
    }
    // Resources
    let newGold = session.user.resources.gold + rewards.gold
    session.user.resources.gold = newGold < 1000000 ? newGold : 1000000
    session.user.resources.gems = rewards.price ? session.user.resources.gems - rewards.price : session.user.resources.gems + rewards.gems

    // Cards
    for (let card of rewards.cards) {
        if (session.user.cards[card.id] !== undefined) session.user.cards[card.id][1] += card.quantity
        else {
            session.cardsBuf.push(card.id)
            session.user.cards[card.id] = [1, card.quantity]
        }
    }
    session.user.markModified('cards')

    session.user.save()
    return true
}

module.exports.upgradeCard = (user, card, level) => {
    user.cards[card][0] += 1
    user.cards[card][1] -= level.requiredCards
    user.markModified('cards')

    user.resources.gold -= level.upgradePrice
    user.stats.exp += level.exp
    if (user.stats.exp >= levels[user.stats.level].requiredExp) {
        user.stats.exp -= levels[user.stats.level].requiredExp
        user.stats.level += 1
    }

    user.save()
    return true
}

module.exports.buyGold = (user, pack) => {
    user.resources.gold += pack.quantity
    user.resources.gems -= pack.price

    user.save()
    return true
}

module.exports.joinClan = (user, clan) => {
    user.clan.tag = clan.tag
    user.clan.name = clan.name
    user.clan.badge = clan.info.badge
    user.clan.role = clanRoles.member.id

    user.save()
}

module.exports.leaveClan = user => {
    user.clan = {}

    user.save()
}

module.exports.selectDeck = (user, deck) => {
    user.resources.currentDeck = deck

    user.save()
}

module.exports.changeDeckCard = (user, card, slot) => {
    user.decks[user.resources.currentDeck].cards[slot] = parseInt(card)
    user.markModified('decks')
    
    user.save()
}

module.exports.changeNick = (user, nick) => {
    user.nick = nick

    user.save()
}

module.exports.changeRole = (user, role) => {
    user.clan.role = role

    user.save()
}