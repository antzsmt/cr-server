const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 10212

module.exports.decode = payload => ByteBuffer.fromBinary(payload).readIString()

module.exports.callback = async (session, name) => {
    db.controllers.user.changeNick(session.user, name)
    session.send(packets.ServerCommands.code, packets.ServerCommands.encode(null, { id: 201, params: { name: name } }))
}