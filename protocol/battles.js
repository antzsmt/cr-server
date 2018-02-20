let matchMaking = require('../packets/client/ClientCommands/handlers/startBattle')

module.exports.cancelMatchMake = session => {
    if(session.battle === null){
        delete matchMaking.queue[session.user.tag]
        session.send(packets.CancelMatchmakeOk.code, packets.CancelMatchmakeOk.encode())
    }
}

module.exports.command = (session, data) => {
    for (let command of data.commands) {
        if (command.type === 1) {
            session.battle.commands.push(command)
        }
    }
}

module.exports.event = (session, event) => {
    session.battle.sendEvent(event, session.user.tag)
}

module.exports.trainment = session => {
    session.send(packets.TrainmentBattleInfo.code, packets.TrainmentBattleInfo.encode(session.user))
}
