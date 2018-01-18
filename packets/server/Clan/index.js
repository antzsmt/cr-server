const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const tag2id = require('../../../logic/utils/tag2id')
const calc = require('../../../logic/utils/calc')

module.exports.code = 24301

module.exports.encode = clan => {
    let buffer = ByteBuffer.allocate(2000)

    buffer.writeInt32(clan.tagId.high)
    buffer.writeInt32(clan.tagId.low)
    buffer.writeIString(clan.name) //NAME
    buffer.writeRrsInt32(16)
    buffer.writeRrsInt32(clan.info.badge) //BADGE
    buffer.writeByte(clan.info.access) // STATUS
    buffer.writeByte(clan.memberCount) // MEMBERS
    buffer.writeRrsInt32(clan.info.trophies) //TROPHIES
    buffer.writeRrsInt32(clan.info.requiredTrophies) //REQUIRED TROPHIES
    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeRrsInt32(5)
    buffer.writeRrsInt32(2578)
    buffer.writeRrsInt32(clan.info.donations) //DONATIONS
    buffer.writeRrsInt32(5)
    buffer.writeByte(0)
    buffer.writeByte(57)
    buffer.writeRrsInt32(clan.info.region) // REGION
    buffer.writeByte(0)

    buffer.writeIString(clan.info.description)

    buffer.writeRrsInt32(clan.memberCount)
    if (clan.memberCount) {
        let members = Object.keys(clan.members).sort((a, b) => clan.members[b][1] - clan.members[a][1])
        for (let i = 0; i < clan.memberCount; i++) {
            let id = tag2id.tag2id(members[i])
            let member = clan.members[members[i]]

            buffer.writeInt32(id.high)
            buffer.writeInt32(id.low)
            buffer.writeIString(member[0]) // NICK
            buffer.writeRrsInt32(54) // SCID ARENA
            buffer.writeRrsInt32(calc.arena(member[1]))
            buffer.writeByte(member[3]) // ROLE
            buffer.writeByte(member[4]) // LVL
            buffer.writeRrsInt32(member[1]) // TROPHIES
            buffer.writeRrsInt32(member[2]) // DONATIONS

            buffer.writeVarint32(15)

            buffer.writeByte(i + 1) //RANK
            buffer.writeByte(i) // PREV RANK

            buffer.writeRrsInt32(0) // CLAN CHEST CROWNS
            buffer.writeRrsInt32(26126)

            buffer.writeRrsInt32(-64)
            buffer.writeRrsInt32(-64)
            buffer.writeByte(38)
            buffer.writeByte(5)
            buffer.writeInt32(id.high)
            buffer.writeInt32(id.low)
        }
    }
    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeRrsInt32(10) // CLAN CHEST CROWNS
    return buffer.buffer.slice(0, buffer.offset)
}