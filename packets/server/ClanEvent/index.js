const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const events = require('../../../logic/clans/entriesIds.json')
const random = require('../../../services/chests/random')

module.exports.code = 24312

module.exports.encode = event => {
    let buffer = ByteBuffer.allocate(500)
    buffer.writeByte(event.id)
    buffer.writeRrsInt32(random.number(11, 30))
    buffer.writeRrsInt32(random.number(1, 10000))
    let objectUserId = !event.objectUser || event.tag === event.objectUser ? event.player.tagId : event.objectUser
    buffer.writeRrsInt32(event.player.tagId.high)
    buffer.writeRrsInt32(event.player.tagId.low)
    buffer.writeRrsInt32(objectUserId.high)
    buffer.writeRrsInt32(objectUserId.low)
    buffer.writeIString(event.player.nick)
    buffer.writeRrsInt32(10)
    buffer.writeRrsInt32(event.player.role ? event.player.role : 1)
    buffer.writeRrsInt32(0)
    buffer.writeRrsInt32(0)

    switch (event.id) {
        case events.MEMBER_ACTION.code:
            buffer.writeRrsInt32(event.actionType)
            switch (event.actionType) {
                case events.MEMBER_ACTION.JOINED:
                case events.MEMBER_ACTION.LEFT:
                    buffer.writeRrsInt32(event.player.tagId.high)
                    buffer.writeRrsInt32(event.player.tagId.low)
                    buffer.writeInt32(0)
                    break
                default:
                    buffer.writeRrsInt32(event.player.tagId.high)
                    buffer.writeRrsInt32(event.player.tagId.low)
                    buffer.writeIString(event.initiator.nick)
                    break
            }
            break
        case events.MESSAGE:
            buffer.writeIString(event.message)
            break
    }
    return buffer.buffer.slice(0, buffer.offset)
}

/*
    02
    00 8d97848309
    00 94bbb901 
    00 94bbb901
    00000004 6a646a66
    0a
    01
    00
    00
    00000004 74657374
*/