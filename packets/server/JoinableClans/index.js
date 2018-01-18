const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 24304

module.exports.encode = clans => {
    let buffer = ByteBuffer.allocate(2000)

    buffer.writeRrsInt32(clans.length)
    for (let i = 0; i < clans.length; i++) {
        buffer.writeInt32(clans[i].tagId.high)
        buffer.writeInt32(clans[i].tagId.low)
        buffer.writeIString(clans[i].name) //NAME
        buffer.writeRrsInt32(16)
        buffer.writeRrsInt32(clans[i].info.badge) //BADGE
        buffer.writeByte(clans[i].info.access) // STATUS
        buffer.writeByte(clans[i].memberCount) // MEMBERS
        buffer.writeRrsInt32(clans[i].info.trophies) //TROPHIES
        buffer.writeRrsInt32(clans[i].info.requiredTrophies) //REQUIRED TROPHIES
        buffer.writeByte(0)
        buffer.writeByte(0)
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(100)
        buffer.writeRrsInt32(clans[i].info.donations) //DONATIONS
        buffer.writeRrsInt32(182)
        buffer.writeByte(2)
        buffer.writeByte(i)
        buffer.writeByte(57)
        buffer.writeRrsInt32(clans[i].info.region) // REGION
        buffer.writeByte(0)
    }

    return buffer.buffer.slice(0, buffer.offset)
}
