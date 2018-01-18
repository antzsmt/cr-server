module.exports.code = 14104

module.exports.callback = session => {
    session.send(packets.TrainmentBattleInfo.code, packets.TrainmentBattleInfo.encode(session.user))
}