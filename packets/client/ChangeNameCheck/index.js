const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 14600

module.exports.decode = payload => ByteBuffer.fromBinary(payload).readIString()

module.exports.callback = (session, name) => {
    session.send(packets.ChangeNameChecked.code, packets.ChangeNameChecked.encode(name))
}