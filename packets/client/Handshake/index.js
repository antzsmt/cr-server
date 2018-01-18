const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 10100

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    buffer.readInt32()
    buffer.readInt32()
    buffer.readInt32()
    buffer.readInt32()
    buffer.readInt32()
    json.resourceSha = buffer.readIString()
    buffer.readInt32()
    buffer.readInt32()

    return json
}

module.exports.callback = (session, json) => {
    if(json.resourceSha != config.content.sha)
        session.send(packets.LoginFailed.code, packets.LoginFailed.encode('updateContent'), 4)
    else
        session.send(packets.HandshakeOk.code, packets.HandshakeOk.encode())
}