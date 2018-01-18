const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const towers = require('../../../logic/battles/towers.json')

module.exports.code = 21903

module.exports.encode = user => {
    let buffer = ByteBuffer.allocate(500)

    buffer.writeByte(0) // UNCOMPRESSED
    buffer.append('2a027f7f7f7f0000000000000200000000000000000000000000000800000000000000000100000000000000000000000102', 'hex')
    buffer.writeRrsInt32(user.tagId.high)
    buffer.writeRrsInt32(user.tagId.low)
    buffer.writeRrsInt32(user.tagId.high)
    buffer.writeRrsInt32(user.tagId.low)
    buffer.writeRrsInt32(user.tagId.high)
    buffer.writeRrsInt32(user.tagId.low)
    buffer.writeIString(user.nick)
    buffer.append('0200000000000000002400000000000800000000000000000600903f960900b916901404a9020c000000002b002185baa9a50b0b005b71545fac9380a905020212017f7f00', 'hex')
    buffer.writeRrsInt32(user.tagId.high)
    buffer.writeRrsInt32(user.tagId.low)
    buffer.append('0000000000000000000701000009000000010000008e02f27d0000067a06230123012301230123002300010001000001050005010502050305040505', 'hex')

    /** TOWERS */
    //Own right tower
    buffer.writeRrsInt32(user.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.own.right.x)
    buffer.writeRrsInt32(towers.coordinates.own.right.y)
    buffer.append('00007f00c07c0000020000000000', 'hex')
    // Enemy right tower
    buffer.writeRrsInt32(user.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.enemy.right.x)
    buffer.writeRrsInt32(towers.coordinates.enemy.right.y)
    buffer.append('00007f0080040000010000000000', 'hex')
    //Own left tower
    buffer.writeRrsInt32(user.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.own.left.x)
    buffer.writeRrsInt32(towers.coordinates.own.left.y)
    buffer.append('00007f00c07c0000010000000000', 'hex')
    //Enemy left tower
    buffer.writeRrsInt32(user.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.enemy.left.x)
    buffer.writeRrsInt32(towers.coordinates.enemy.left.y)
    buffer.append('00007f0080040000020000000000', 'hex')
    //Enemy king tower
    buffer.writeRrsInt32(user.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.enemy.king.x)
    buffer.writeRrsInt32(towers.coordinates.enemy.king.y)
    buffer.append('00007f00800400000000000000000d0404017b060402010703007f7f000000000500000000007f7f7f7f7f7f7f7f00000000', 'hex')
    // Own King tower
    buffer.writeRrsInt32(user.stats.level - 1) // level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.own.king.x)
    buffer.writeRrsInt32(towers.coordinates.own.king.y)
    buffer.append('00007f00c07c00000000000000000d04027f03010400030607007f7f000000000500000000007f7f7f7f7f7f7f7f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[user.stats.level].right)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[user.stats.level].right)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[user.stats.level].left)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[user.stats.level].left)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[user.stats.level].king)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[user.stats.level].king)

    buffer.append('0000000000000000a401a4010000000000000000a401a4010000000000000000a401a4010000000000000000a401a4010000000000000000a401a4010000000000000000a401a40100ff0186010814083a0629069a01031b0018001e0000fe03', 'hex')
    for (let i = 0; i < 8; i++) {
        let card = user.decks[user.resources.currentDeck].cards[i]
        buffer.writeRrsInt32(card)
        buffer.writeRrsInt32(user.cards[card][0] - 1) // Level - 1
    }
    buffer.append('0000050602020402010300000000000000000c00000093df85c80800', 'hex')

    return buffer.buffer.slice(0, buffer.offset)

}