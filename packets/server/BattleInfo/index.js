const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const towers = require('../../../logic/battles/towers.json')

module.exports.code = 21903

module.exports.encode = (player1, player2) => {
    // TO DO
    let buffer = ByteBuffer.allocate(500)
    buffer.writeByte(0) // UNCOMPRESSED
    buffer.append('2a02', 'hex')
    buffer.writeRrsInt32(player1.tagId.high)
    buffer.writeRrsInt32(player1.tagId.low)
    buffer.writeRrsInt32(player1.tagId.high)
    buffer.writeRrsInt32(player1.tagId.low)
    buffer.writeRrsInt32(player1.tagId.high)
    buffer.writeRrsInt32(player1.tagId.low)
    buffer.writeIString(player1.nick)
    buffer.append('029b0200000000000000240000000000080000000000000000070004000000017f050000000102', 'hex')
    buffer.writeRrsInt32(player2.tagId.high)
    buffer.writeRrsInt32(player2.tagId.low)
    buffer.writeRrsInt32(player2.tagId.high)
    buffer.writeRrsInt32(player2.tagId.low)
    buffer.writeRrsInt32(player2.tagId.high)
    buffer.writeRrsInt32(player2.tagId.low)
    buffer.writeIString(player2.nick)
    buffer.append('021d0000000000000024000000000008000000000000000006000100000000000500000001002b00219fe2bda50b0b0000a79b0c0503020002', 'hex')
    buffer.writeRrsInt32(player1.tagId.high)
    buffer.writeRrsInt32(player1.tagId.low)
    buffer.writeByte(0)
    buffer.writeRrsInt32(player2.tagId.high)
    buffer.writeRrsInt32(player2.tagId.low)
    buffer.append('000000000000000000010100000700000000000000b903c77c0000067a06230123012301230123002300010001000001050005010502050305040505', 'hex')
     /** TOWERS */
    //Own right tower
    buffer.writeRrsInt32(player1.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.own.right.x)
    buffer.writeRrsInt32(towers.coordinates.own.right.y)
    buffer.append('00007f00c07c0000020000000000', 'hex')
    // Enemy right tower
    buffer.writeRrsInt32(player2.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.enemy.right.x)
    buffer.writeRrsInt32(towers.coordinates.enemy.right.y)
    buffer.append('00007f0080040000010000000000', 'hex')
    //Own left tower
    buffer.writeRrsInt32(player1.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.own.left.x)
    buffer.writeRrsInt32(towers.coordinates.own.left.y)
    buffer.append('00007f00c07c0000010000000000', 'hex')
    //Enemy left tower
    buffer.writeRrsInt32(player2.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.enemy.left.x)
    buffer.writeRrsInt32(towers.coordinates.enemy.left.y)
    buffer.append('00007f0080040000020000000000', 'hex')
    //Enemy king tower
    buffer.writeRrsInt32(player2.stats.level - 1) //Level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.enemy.king.x)
    buffer.writeRrsInt32(towers.coordinates.enemy.king.y)
    buffer.append('00007f00800400000000000000000d0404017b060402010703007f7f000000000500000000007f7f7f7f7f7f7f7f00000000', 'hex')
    // Own King tower
    buffer.writeRrsInt32(player1.stats.level - 1) // level
    buffer.writeByte(13)
    buffer.writeRrsInt32(towers.coordinates.own.king.x)
    buffer.writeRrsInt32(towers.coordinates.own.king.y)
    buffer.append('00007f00c07c00000000000000000d04027f03010400030607007f7f000000000500000000007f7f7f7f7f7f7f7f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[player1.stats.level].right)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[player2.stats.level].right)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[player1.stats.level].left)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[player2.stats.level].left)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[player2.stats.level].king)
    buffer.writeByte(0)
    buffer.writeRrsInt32(towers.hp[player1.stats.level].king)
    buffer.append('0000000000000000a401a4010000000000000000a401a4010000000000000000a401a4010000000000000000a401a4010000000000000000a401a4010000000000000000a401a401', 'hex')
    buffer.writeByte(0)
    buffer.writeByte(-1)
    buffer.writeByte(1)
    for(let card of player1.decks[player1.resources.currentDeck].cards){
        buffer.writeRrsInt32(parseInt(card))
        buffer.writeRrsInt32(player1.cards[card][0] - 1) // LEVEL
    }

    buffer.writeByte(0)
    buffer.writeByte(-2)
    buffer.writeByte(3)
    for(let card of player2.decks[player2.resources.currentDeck].cards){
        buffer.writeRrsInt32(parseInt(card))
        buffer.writeRrsInt32(player2.cards[card][0] - 1) // LEVEL
    }
    
    buffer.append('0000050602020402010300000000000000000c000000add9a79d0300', 'hex')

    return buffer.buffer.slice(0, buffer.offset)
}