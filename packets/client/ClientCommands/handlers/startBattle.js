const Battle = require('../../../../logic/battles/Battle')

let lookingForBattle = {}

module.exports = async session => {
    session.battle = null
    if (Object.keys(lookingForBattle).length) {
        let rival = Object.keys(lookingForBattle)[0]
        // REMOVE FOR QUEUE
        delete lookingForBattle[rival]
        delete lookingForBattle[session.user.tag]

        let battle = new Battle([session, clients[rival]])
        session.battle = battle
        clients[rival].battle = battle
        battle.start()
    } else {
        lookingForBattle[session.user.tag] = {
            battling: false
        }
    }
}

module.exports.queue = lookingForBattle