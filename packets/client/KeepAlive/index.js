module.exports.code = 10108

module.exports.callback = session => {
    session.send(packets.KeepAliveOk.code, packets.KeepAliveOk.encode())
}