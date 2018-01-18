const cards = require('../../../../logic/cards')

module.exports = (session, cmd) => {
    let card = session.cardsBuf[cmd.params.card]
    let oldCard = session.user.decks[session.user.resources.currentDeck].cards[cmd.params.slot]
    
    db.controllers.user.changeDeckCard(session.user, card, cmd.params.slot)
    session.cardsBuf[cmd.params.card] = oldCard
}