const lookingForBattle = {}

module.exports = async session => {
    if (Object.keys(lookingForBattle).length) {
        let rival = Object.keys(lookingForBattle)[0]
        lookingForBattle[rival].battling = true
        lookingForBattle[rival].rival = session.user.tag
        lookingForBattle[session.user.tag] = {
            time: Date.now(),
            battling: true,
            rival: rival
        }
    } else {
        lookingForBattle[session.user.tag] = {
            time: Date.now(),
            battling: false
        }
    }
    // ONLY TO GO UNTIL WE HAVE A PROPER MATCHMAKING SYSTEM
    while (!session.battle || !session.battle.joined) {
        if (lookingForBattle[session.user.tag].battling) {
            session.battle = {
                commands: [],
                rival: lookingForBattle[session.user.tag].rival,
                joined: true
            }
            delete lookingForBattle[session.user.tag]
            session.battle.deck = session.user.decks[session.user.resources.currentDeck]
            session.send(packets.StopHomeLogic.code, packets.StopHomeLogic.encode())
            session.send(packets.BattleInfo.code, packets.BattleInfo.encode(session.user, clients[session.battle.rival].user))
            let id = 1
            session.battle.hearBeat = setInterval(() => {
                session.send(packets.BattleHearbeat.code, packets.BattleHearbeat.encode(id, session.battle.commands))
                if (session.battle.commands.length) session.battle.commands = []
                id += 1
            }, 500)
            // TO DO
            setTimeout(() => {
                session.send(packets.BattleResult.code, packets.BattleResult.encode())
                clearInterval(session.battle.hearBeat)
                session.battle = null
            }, 20000)
        } else {
            await sleep(1000)
        }
    }
}

const sleep = ms => new Promise(r => {
    setTimeout(() => {
        r()
    }, ms)
})