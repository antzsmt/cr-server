const cardLevels = require('../../../../logic/cardLevels')
const cards = require('../../../../logic/cards')
const rarities = require('../../../../logic/rarities')

module.exports = (session, cmd) => {
    let card = cards.scid[cmd.params.card]

    let userCard = session.user.cards[card.id]
    if (userCard === undefined) return false // If user haven't already unlocked the card

    let level = cardLevels[rarities[card.rarity]][userCard[0]]
    if (level.max) return false // Card maxed
    if (userCard[1] < level.requiredCards) return false // Not enough cards
    if (session.user.resources.gold < level.upgradePrice) return false // Not enough gold

    db.controllers.user.upgradeCard(session.user, card.id, level)
}