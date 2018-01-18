module.exports.code = 14303

module.exports.callback = async session => {
    let clans = await db.controllers.clan.findJoinable()
    session.send(packets.JoinableClans.code, packets.JoinableClans.encode(clans))
}