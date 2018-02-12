const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')

module.exports.code = 14113

module.exports.decode = payload => {
    let buffer = ByteBuffer.fromBinary(payload)
    let json = {}

    json.id = {
        high: buffer.readInt32(),
        low: buffer.readInt32()
    }

    return json
}

module.exports.callback = async (session, json) => {
    let user = await db.controllers.user.find({tag: tag2id.id2tag(json.id.high, json.id.low)})
    console.log('asking for', tag2id.id2tag(json.id.high, json.id.low))
    if(user)
        session.send(packets.Profile.code, packets.Profile.encode(user))
    else
        session.send(packets.ProfileNotExists.code, packets.ProfileNotExists.encode(json.id))
}