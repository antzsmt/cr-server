const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const cards = require('../../../logic/cards')
const tag2id = require('../../../logic/utils/tag2id')

module.exports.code = 24113

module.exports.encode = user => {
    let buffer = ByteBuffer.allocate(2000)

    buffer.writeRrsInt32(8)
    buffer.writeRrsInt32(0)
    buffer.writeRrsInt32(-128)

    // DECK
    for (let i = 0; i <= 7; i++) {
        let card = user.decks[user.resources.currentDeck].cards[i]
        buffer.writeRrsInt32(card) // CARD ID
        buffer.writeRrsInt32(user.cards[card][0]) // LEVEL
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(user.cards[card][1]) // COUNT
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
      }

    buffer.writeInt32(user.tagId.high)
    buffer.writeInt32(user.tagId.low)

    buffer.writeByte(0) // IF 1 => C. (RRSINT-RRSINT)

    buffer.writeRrsInt32(0) // SEASONS COUNT
    /* SEASONS COMPONENT */

    buffer.writeByte(1)

    for (let i = 0; i < 3; i++) {
        buffer.writeRrsInt32(user.tagId.high)
        buffer.writeRrsInt32(user.tagId.low)
    }

    buffer.writeIString(user.nick)
    buffer.writeByte(0) // NAME CHANGED

    buffer.writeRrsInt32(user.stats.arena + 1)
    buffer.writeRrsInt32(user.stats.trophies)
    buffer.writeRrsInt32(0) // UNKNOWN
    buffer.writeRrsInt32(0)
    buffer.writeRrsInt32(0) // LEGEND TROPHIES
    buffer.writeRrsInt32(0) // SEASON RECORD
    buffer.writeRrsInt32(0)
    buffer.writeRrsInt32(0) // BEST SEASON RANK
    buffer.writeRrsInt32(0) // BEST SEASON TROPHIES

    buffer.writeByte(0)
    buffer.writeByte(37)

    buffer.writeRrsInt32(0) // PREVIOUS SEASON RANK
    buffer.writeRrsInt32(0) // PREVIOUS SEASON TROPHIES
    buffer.writeRrsInt32(0) // PREVIOUS SEASON RECORD

    buffer.writeRrsInt32(0)
    buffer.writeByte(0)
    buffer.writeByte(8)

    buffer.writeRrsInt32(7) // COMPONENT LENGTH

    buffer.writeByte(5)
    buffer.writeByte(1)
    buffer.writeRrsInt32(user.resources.gold)

    buffer.writeByte(5)
    buffer.writeByte(2)
    buffer.writeRrsInt32(0) // WON CHESTS

    buffer.writeByte(5)
    buffer.writeByte(3)
    buffer.writeRrsInt32(0)

    buffer.writeByte(5)
    buffer.writeByte(4)
    buffer.writeRrsInt32(0)

    buffer.writeByte(5)
    buffer.writeByte(5)
    buffer.writeRrsInt32(user.resources.gold)

    buffer.writeByte(5)
    buffer.writeByte(13)
    buffer.writeRrsInt32(0)

    buffer.writeByte(5)
    buffer.writeByte(28)
    buffer.writeByte(0)

    buffer.writeByte(00)
    buffer.writeRrsInt32(0) // C. LENGTH (BYTE-BYTE-RRSINT32)
    buffer.writeRrsInt32(0) // C. LENGTH (BYTE-BYTE-RRSINT32)

    buffer.writeRrsInt32(9) // C. LENGTH

    buffer.writeByte(5)
    buffer.writeByte(6)
    buffer.writeRrsInt32(user.stats.record) // U. Record

    buffer.writeByte(5)
    buffer.writeByte(7)
    buffer.writeRrsInt32(125) // 3 Crown Wins

    buffer.writeByte(5)
    buffer.writeByte(8)
    buffer.writeRrsInt32(Object.keys(user.cards).length)

    buffer.writeByte(5)
    buffer.writeByte(9)
    buffer.writeRrsInt32(cards.id[1].scid) // FAVOURITE CARD

    buffer.writeByte(5)
    buffer.writeByte(10)
    buffer.writeRrsInt32(5000) // DONATIONS

    buffer.writeByte(5)
    buffer.writeByte(11)
    buffer.writeRrsInt32(10)

    buffer.writeByte(5)
    buffer.writeByte(20)
    buffer.writeRrsInt32(6) // SURVIVAL MAX WINS

    buffer.writeByte(5)
    buffer.writeByte(21)
    buffer.writeRrsInt32(142)

    buffer.writeByte(5)
    buffer.writeByte(27)
    buffer.writeRrsInt32(8) // MAX ARENA

    buffer.writeRrsInt32(0) // C.LENGTH - CARDS (3x RRSINT32)
    buffer.writeByte(0) // IF 1 => C. (RRSINT-BYTE-BYTE)
    buffer.writeByte(0)

    buffer.writeRrsInt32(user.resources.gems)
    buffer.writeRrsInt32(user.resources.gems)
    buffer.writeRrsInt32(user.stats.exp)
    buffer.writeRrsInt32(user.stats.level)
    buffer.writeRrsInt32(0)

    buffer.writeByte(user.clan.tag ? 9 : 1) // HAS CLAN ? 9 : Yes, 1: No
    if (user.clan.tag) {
        let tag = tag2id.tag2id(user.clan.tag)
        buffer.writeRrsInt32(tag.high)
        buffer.writeRrsInt32(tag.low) // CLAN ID
        buffer.writeIString(user.clan.name) //CLAN NAME
        buffer.writeRrsInt32(user.clan.badge) // CLAN BADGE
        buffer.writeByte(user.clan.role) // PLAYER ROLE
    }


    buffer.writeRrsInt32(0) // BATTLES PLAYED
    buffer.writeRrsInt32(0) // TOURNEY BATTLES PLAYED
    buffer.writeRrsInt32(0)

    buffer.writeRrsInt32(0) // WINS
    buffer.writeRrsInt32(0) // LOSES
    buffer.append('7f90023c00000002099e94960c099e94960c099e94960c000000007f0100000000000000000027000000000008090501a9010502010503010505a901050d00050e0005108e09051d8888d54405260000033c07063c08063c09060002050806050b27041a00011a01011a03021a0d010000a401a4010001000000000000000001000000010000', 'hex')

    return buffer.buffer.slice(0, buffer.offset)
}