const shopPacks = require('../../../../logic/shopPacks')

module.exports = (session, cmd) => {
    let pack = shopPacks.gold[cmd.params.pack]
    if (pack === undefined) return false // Packet doesn't exists

    if (session.user.resources.gems < pack.price) return false // Not enough gems
    if (session.user.resources.gold + pack.quantity > 1000000) return false // Exceeds gold max

    db.controllers.user.buyGold(session.user, pack)
}