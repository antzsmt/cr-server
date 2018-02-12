
class Battle {
    constructor(sessions){
        this.hearBeatId = 1
        this.commands = []
        this.players = sessions
        setTimeout(() => {
            this.finish()
        }, 60000)
    }

    start() {
        this.players[0].send(packets.StopHomeLogic.code, packets.StopHomeLogic.encode())
        this.players[1].send(packets.StopHomeLogic.code, packets.StopHomeLogic.encode())
        this.players[0].send(packets.BattleInfo.code, packets.BattleInfo.encode(this.players[0].user, this.players[1].user))
        this.players[1].send(packets.BattleInfo.code, packets.BattleInfo.encode(this.players[0].user, this.players[1].user))
        this.hearBeat = setInterval(() => {
            this.sendHearBeat()
        }, 500)
    }

    sendHearBeat() {
        this.players[0].send(packets.BattleHearbeat.code, packets.BattleHearbeat.encode(this.hearBeatId, this.commands))
        this.players[1].send(packets.BattleHearbeat.code, packets.BattleHearbeat.encode(this.hearBeatId, this.commands))
        this.commands = []
        this.hearBeatId += 1 
    }

    sendResult(){
        this.players[0].send(packets.BattleResult.code, packets.BattleResult.encode())
        this.players[1].send(packets.BattleResult.code, packets.BattleResult.encode())
    }

    sendEvent(event, from){
        let to = this.players[0].user.tag === from ? this.players[1] : this.players[0] // Send to rival
        to.send(packets.BattleEvent.code, packets.BattleEvent.encode(event))
    }

    finish(){
        this.sendResult()
        clearInterval(this.hearBeat)
        this.players[0].battle = null
        this.players[1].battle = null
    }
}

module.exports = Battle