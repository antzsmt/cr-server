const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')

module.exports.code = 14302

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
    let clan = await db.controllers.clan.findByTag(tag2id.id2tag(json.id.high, json.id.low))

    if(clan)
        session.send(packets.Clan.code, packets.Clan.encode(clan))
}