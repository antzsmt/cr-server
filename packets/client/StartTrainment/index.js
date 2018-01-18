module.exports.code = 14104

module.exports.callback = session => {
    session.send(packets.BattleInfo.code, packets.BattleInfo.encode(session.user))
}