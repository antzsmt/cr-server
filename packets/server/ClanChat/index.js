const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const entries = require('../../../logic/clans/entriesIds.json')
const random = require('../../../services/chests/random')

module.exports.code = 24311

module.exports.encode = chat => {
    let buffer = ByteBuffer.allocate(2000)
    buffer.writeRrsInt32(chat.length)

    for (let entry of chat) {
        switch (entry[0]) {
            case entries.MESSAGE:
                writeHeader(buffer, {
                    id: entries.MESSAGE,
                    name: entry[3],
                    tag: entry[1],
                    role: entry[4],
                    time: entry[5]
                })
                buffer.writeIString(entry[2])
                break

            case entries.MEMBER_ACTION.code:
                writeHeader(buffer, {
                    id: entries.MEMBER_ACTION.code,
                    name: entry[3],
                    tag: entry[2],
                    role: 1,
                    time: entry[4]
                })
                buffer.writeRrsInt32(entry[1])
                let userId = tag2id.tag2id(entry[2])
                buffer.writeRrsInt32(userId.high)
                buffer.writeRrsInt32(userId.low)
                switch (entry[1]) {
                    case entries.MEMBER_ACTION.JOINED:
                    case entries.MEMBER_ACTION.LEFT:
                        buffer.writeInt32(0)
                        break
                    default:
                        buffer.writeIString(entry[5])
                        break
                }
                break
        }
    }

    return buffer.buffer.slice(0, buffer.offset)
}
const writeHeader = (buffer, values, clanId) => {
    buffer.writeRrsInt32(values.id)
    buffer.writeRrsInt32(random.number(0, 10))
    buffer.writeRrsInt32(random.number(1, 10000))

    let userId = tag2id.tag2id(values.tag)
    let objectUserId = !values.objectUser || values.tag === values.objectUser ? userId : tag2id.tag2id(values.objectUser)
    buffer.writeRrsInt32(userId.high)
    buffer.writeRrsInt32(userId.low)
    buffer.writeRrsInt32(objectUserId.high)
    buffer.writeRrsInt32(objectUserId.low)
    buffer.writeIString(values.name)
    buffer.writeRrsInt32(5)
    buffer.writeRrsInt32(values.role)
    buffer.writeRrsInt32(timestamp() - values.time)
    buffer.writeByte(0)
}

const timestamp = () => Date.now() / 1000 | 0