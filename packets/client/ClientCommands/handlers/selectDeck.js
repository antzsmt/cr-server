module.exports = (session, cmd) => {
    if(cmd.deck > 4 || cmd.deck < 0) return false
    if(session.user.stats.level < 8 && cmd.deck > 2) return false

    db.controllers.user.selectDeck(session.user, cmd.params.deck)
}