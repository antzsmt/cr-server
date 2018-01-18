module.exports.code = 14101

module.exports.callback = session => session.send(packets.AccountInfo.code, packets.AccountInfo.encode(session.user))