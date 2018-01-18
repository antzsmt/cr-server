let matchMakingQueue = require('../ClientCommands/handlers/startBattle')

module.exports.code = 14107

module.exports.callback = session => {
    if(session.battle === null){
        delete matchMakingQueue[session.user.tag]
        session.send(packets.CancelMatchmakeOk.code, packets.CancelMatchmakeOk.encode())
    }
}