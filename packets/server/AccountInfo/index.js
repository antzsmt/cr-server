const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const cards = require('../../../logic/cards')
const chests = require('../../../logic/chests.json')
const tag2id = require('../../../logic/utils/tag2id')

module.exports.code = 24101

module.exports.encode = user => {
    let buffer = ByteBuffer.allocate(1500)
    buffer.writeInt32(user.tagId.high)
    buffer.writeInt32(user.tagId.low)
    buffer.writeRrsInt32(127) // CHECKSUM SEED
    buffer.writeRrsInt32(257)
    buffer.writeRrsInt32(3250)
    buffer.writeRrsInt32(168720) // TICK?
    buffer.writeRrsInt32(Date.now() / 1000 | 0) // UNKNOWN TIMESTAMP
    buffer.writeByte(1)

    buffer.writeByte(user.decks.length) // DECKS COUNT

    for (let deck of user.decks) {
        buffer.writeByte(deck.cards.length) // CARDS COUNT
        for (let card of deck.cards) {
            buffer.writeRrsInt32(cards.id[card].scid)
        }
    }

    buffer.writeByte(-1)

    // CURRENT DECK
    for (let card of user.decks[user.resources.currentDeck].cards) {
        buffer.writeRrsInt32(parseInt(card))
        buffer.writeRrsInt32(user.cards[card][0] - 1) // LEVEL
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(user.cards[card][1]) // COUNT
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
    }

    let userCardsIds = Object.keys(user.cards)
    buffer.writeRrsInt32(userCardsIds.length)
    for (let card of userCardsIds) {
        buffer.writeRrsInt32(parseInt(card))
        buffer.writeRrsInt32(user.cards[card][0] - 1) // LEVEL
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(user.cards[card][1]) // COUNT
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
    }
    buffer.writeRrsInt32(user.resources.currentDeck)
    buffer.append('ff0d007f000000008301007f0000000017007f000000008f01007f0000000001007f0000000007007f000000009301007f000000000c007f000000001d9e137f', 'hex')
    buffer.writeRrsInt32(1511717732) // TS
    buffer.writeByte(1)
    buffer.writeByte(0)

    buffer.writeRrsInt32(config.events.length)

    for (let event of config.events) {
        buffer.writeRrsInt32(event.id)
        buffer.writeIString(event.name)
        buffer.writeByte(event.type)
        buffer.writeRrsInt32(event.startTime)
        buffer.writeRrsInt32(event.endTime)
        buffer.writeRrsInt32(event.visibleOn)
        buffer.writeInt32(0)
        buffer.writeInt32(0)
        buffer.writeIString(event.name)
        buffer.writeIString(event.json)
    }

    buffer.writeInt32(0) // 4x 0x00
    buffer.writeByte(2)
    buffer.writeByte(0)
    buffer.writeRrsInt32(1511424000) // TIMESTAMP
    buffer.writeInt32(0) // 4x 0x00
    buffer.writeRrsInt32(0) // C. LENGTH (RRSINT-BYTE)
    buffer.writeRrsInt32(0) // C. LENGTH (RRSINT-BYTE-BYTE)
    buffer.writeByte(2)
    buffer.writeIString('{}') // CARD RELEASE Ex. {"ID":"CARD_RELEASE_V2","Params":{"Cards":[{"Spell":"SkeletonBalloon","Date":"20171117"}]}}
    buffer.writeByte(4)

    buffer.writeIString('{}') // CLAN CHEST ex. {"ID":"CLAN_CHEST","Params":{"StartTime":"20170317T070000.000Z","ActiveDuration":"P3dT0h","InactiveDuration":"P4dT0h","ChestType":["ClanCrowns"]}}

    buffer.writeByte(0)
    buffer.writeByte(4)

    // CHESTS
    for (let i = 0; i < user.chests.length; i++) {
        if (i === 0) buffer.writeByte(user.chests[i].slot)
        else buffer.writeByte(8)

        buffer.writeByte(19) // CHEST SCID
        buffer.writeRrsInt32(user.chests[i].id)
        buffer.writeByte(user.chests[i].status)
        if (user.chests[i].status === 8) {
            //OPENING CHEST
            buffer.writeRrsInt32(80400)
            buffer.writeRrsInt32(10000)
            buffer.writeRrsInt32((Date.now() / 1000 | 0) + 120)
        }
        buffer.writeRrsInt32(user.chests[i].slot) // ID
        buffer.writeByte(1)
        buffer.writeByte(user.chests[i].slot)
        buffer.writeByte(0)
        buffer.writeByte(0)
    }

    buffer.writeByte(0)

    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeByte(-64)

    buffer.writeByte(0)
    buffer.writeByte(0)
    buffer.writeByte(-64)

    buffer.append('000000000000000000000000070000007fb0d40380d3c701', 'hex')
    buffer.writeRrsInt32((Date.now() / 1000 | 0) + 100) // CURRENT TS ??
    buffer.writeInt32(127)
    buffer.writeByte(3)
    buffer.writeInt32(0)
    buffer.writeInt32(2)

    buffer.writeRrsInt32(user.stats.level) // OLD LEVEL (ANIMATION)
    buffer.writeByte(54)
    buffer.writeRrsInt32(user.stats.arena < 11 ? user.stats.arena + 1 : user.stats.arena) // OLD ARENA
    buffer.writeByte(6)
    buffer.writeRrsInt32(335)
    buffer.writeByte(1)

    buffer.writeRrsInt32(72000) // NEXT SHOP UPDATE (TICKS) 1 second = 20 ticks
    buffer.writeRrsInt32(72000)
    buffer.writeRrsInt32(1512172799) // UNKNOWN TIMESTAMP (NIGHT AT 11:59 PM)


    buffer.append('0000007f00007f00007f13109605000000000000011a15010a00000000f807', 'hex')

    // CURRENT DECK
    for (let card of user.decks[1].cards) {
        buffer.writeRrsInt32(card)
        buffer.writeRrsInt32(user.cards[card][0] - 1) // LEVEL
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(user.cards[card][1]) // COUNT
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
        buffer.writeRrsInt32(0)
    }

    buffer.writeRrsInt32(0) // C.LENGTH (CARDS => SCID)
    buffer.writeRrsInt32(0) // C.LENGTH (CARDS => SCID)
    buffer.writeRrsInt32(0) // C.LENGTH (CARDS => SCID)

    buffer.append('0000058cd2f83e8dd2f83e8ed2f83e89d2f83e8ad2f83e0800019081a1fe0b000201018ae6bf3302018a8919005a17ca0c5a1bbe8cb2be9d0a000000000000000000010000', 'hex')
    buffer.writeRrsInt32(10)
    buffer.writeRrsInt32(25)
    buffer.writeRrsInt32(50)
    buffer.append('01008f050003010004', 'hex')

    buffer.writeRrsInt32(chests.ids.arenas[9].magical)
    buffer.writeInt32(0)
    buffer.writeInt32(0)
    buffer.writeInt32(0)
    buffer.writeInt32(13)
    buffer.append('0202040104020200040306010400020004000204050304000502000008', 'hex')

    buffer.writeByte(3) //SHOP COUNT
    /*shop.card(buffer, 0, { id: 20, count: 0, gold: 0 })//
    shop.chest(buffer, 1, { id: chests.ids.quests.legendary, gold: 20, bought: 0 })*/
    shop.chest(buffer, 1, { id: chests.ids.special.legendary, gold: 20, bought: 1 })
    shop.chest(buffer, 1, { id: chests.ids.special.legendary, gold: 20, bought: 1 })
    shop.chest(buffer, 1, { id: chests.ids.special.legendary, gold: 20, bought: 1 })

    buffer.writeByte(0)

    buffer.writeByte(0) //EVENT COMPONENT FOR SHOP

    buffer.writeInt32(127)
    buffer.writeRrsInt32(1109)
    buffer.writeByte(0)

    for (let i = 0; i < 3; i++) {
        buffer.writeRrsInt32(user.tagId.high)
        buffer.writeRrsInt32(user.tagId.low)
    }

    buffer.writeIString(user.nick)
    buffer.writeByte(0) // NAME CHANGED

    buffer.writeRrsInt32(user.stats.arena + 1)
    buffer.writeRrsInt32(user.stats.trophies)
    buffer.writeRrsInt32(235) // UNKNOWN
    buffer.writeRrsInt32(2380)
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

    buffer.writeRrsInt32(16) // COMPONENT LENGTH

    buffer.writeByte(5)
    buffer.writeByte(1)
    buffer.writeRrsInt32(user.resources.gold)

    buffer.writeByte(5)
    buffer.writeByte(2)
    buffer.writeRrsInt32(150) // WON CHESTS

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
    buffer.writeByte(12)
    buffer.writeRrsInt32(419) // NEXT SUPERMAGICAL

    buffer.writeByte(5)
    buffer.writeByte(13)
    buffer.writeRrsInt32(0)

    buffer.writeByte(5)
    buffer.writeByte(14)
    buffer.writeRrsInt32(0) // DAILY REWARDS

    buffer.writeByte(5)
    buffer.writeByte(15)
    buffer.writeRrsInt32(0) // NEXT LEGENDARY

    buffer.writeByte(5)
    buffer.writeByte(16)
    buffer.writeRrsInt32(1040) // SHOP DAYS

    buffer.writeByte(5)
    buffer.writeByte(17)
    buffer.writeRrsInt32(1044) // SHOP LEGENDARY

    buffer.writeByte(5)
    buffer.writeByte(18)
    buffer.writeRrsInt32(1043) // SHOP SM

    buffer.writeByte(5)
    buffer.writeByte(19)
    buffer.writeRrsInt32(1049) // SHOP ARENA PACK

    buffer.writeByte(5)
    buffer.writeByte(22)
    buffer.writeRrsInt32(1042) // SHOP EPIC

    buffer.writeByte(5)
    buffer.writeByte(28)
    buffer.writeByte(0)

    buffer.writeByte(5)
    buffer.writeByte(29)
    buffer.writeByte(72000006) // LAST GAME MODE

    buffer.writeByte(00)
    buffer.writeRrsInt32(0) // C. LENGTH (BYTE-BYTE-RRSINT32) (ACHIEVEMENTS)
    buffer.writeRrsInt32(0) // C. LENGTH (BYTE-BYTE-RRSINT32) (ACHIEVEMENTS)

    buffer.writeRrsInt32(9) // C. LENGTH

    buffer.writeByte(5)
    buffer.writeByte(6)
    buffer.writeRrsInt32(user.stats.record) // U. Record

    buffer.writeByte(5)
    buffer.writeByte(7)
    buffer.writeRrsInt32(125) // 3 Crown Wins

    buffer.writeByte(5)
    buffer.writeByte(8)
    buffer.writeRrsInt32(userCardsIds.length)

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
        buffer.writeRrsInt32(user.clan.badge + 1) // CLAN BADGE (+1 because it's id and not scid)
        buffer.writeByte(user.clan.role) // PLAYER ROLE
    }


    buffer.writeRrsInt32(342) // BATTLES PLAYED
    buffer.writeRrsInt32(0) // TOURNEY BATTLES PLAYED
    buffer.writeRrsInt32(0)

    buffer.writeRrsInt32(193) // WINS
    buffer.writeRrsInt32(128) // LOSES

    buffer.append('7d08010000000092b2d8b602', 'hex')
    buffer.writeRrsInt32(Date.now() / 1000 | 0)
    buffer.append('a1ef1a', 'hex')
    return buffer.buffer.slice(0, buffer.offset)
}

module.exports.callback = session => {
    session.cardsBuf = Object.keys(session.user.cards)
}

const shop = {}

shop.chest = (buffer, index, options) => {
    buffer.writeByte(3) // ITEM TYPE
    buffer.writeByte(0)
    buffer.writeByte(index) // INDEX
    buffer.writeRrsInt32(335)
    buffer.writeByte(options.gold ? options.gold : 0) // GOLD
    buffer.writeByte(5)
    buffer.writeByte(1)
    buffer.writeRrsInt32(19) // SCID HI (CHESTS: 19)
    buffer.writeRrsInt32(options.id) // SCID LO
    buffer.writeByte(options.bought) // BOUGHT
}

shop.card = (buffer, index, options) => {
    buffer.writeByte(1) //TYPE
    buffer.writeByte(1)
    buffer.writeByte(index)
    buffer.writeRrsInt32(335)
    buffer.writeByte(options.gold ? options.gold : 0) // GOLD
    buffer.writeByte(5)
    buffer.writeByte(1)
    buffer.writeRrsInt32(cards.id[options.id].hilo.high) // SCID HI (CHESTS: 19)
    buffer.writeRrsInt32(cards.id[options.id].hilo.low)
    buffer.writeRrsInt32(options.count)
    buffer.writeByte(0)
    buffer.writeByte(0)
}