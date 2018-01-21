const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const chests = require('../../../services/chests')

module.exports.code = 24111

module.exports.encode = (session, cmd) => {
    let buffer = ByteBuffer.allocate(500)
    if (session) {
        switch (cmd.id) {
            case 503:
                let chest = session.user.chests.find(chest => chest.slot === cmd.params.chestId)
                if (chest === undefined) return

                let rewards = chests.open(chest.id)
                db.controllers.user.addRewards(session, chest, rewards)

                buffer.writeRrsInt32(210)
                buffer.writeByte(1)
                buffer.writeByte(rewards.draft ? 1 : 0)
                buffer.writeRrsInt32(rewards.cards.length)
                for (let card of rewards.cards) {
                    buffer.writeRrsInt32(card.id)
                        .writeByte(0)
                        .writeByte(0)
                        .writeRrsInt32(card.quantity)
                        .writeByte(0)
                        .writeByte(0)
                        .writeByte(127)
                }

                buffer.writeByte(127)
                    .writeRrsInt32(rewards.gold)
                    .writeRrsInt32(rewards.gems)
                if (rewards.draft) {
                    buffer.writeByte(0)
                    buffer.writeByte(0)
                    buffer.writeByte(0)
                    buffer.writeByte(0)
                    buffer.writeRrsInt32(8031)
                }
                buffer.writeByte(cmd.params.chestId)
                buffer.writeByte(1)
                break
            case 516:
                let chestRewards = chests.open(cmd.params.chestId, true)
                if (chestRewards.price > session.user.gems) return false

                db.controllers.user.addRewards(session, null, chestRewards)

                buffer.writeRrsInt32(210)
                buffer.writeByte(1)
                buffer.writeByte(chestRewards.draft ? 1 : 0)
                buffer.writeRrsInt32(chestRewards.cards.length)
                for (let card of chestRewards.cards) {
                    buffer.writeRrsInt32(card.id)
                        .writeByte(0)
                        .writeByte(0)
                        .writeRrsInt32(card.quantity)
                        .writeByte(0)
                        .writeByte(0)
                        .writeByte(127)
                }

                buffer.writeByte(127)
                    .writeRrsInt32(chestRewards.gold)
                    .writeRrsInt32(chestRewards.gems)

                if (chestRewards.draft) {
                    buffer.writeByte(0)
                    buffer.writeByte(0)
                    buffer.writeByte(0)
                    buffer.writeByte(0)
                    buffer.writeRrsInt32(8031)
                }
                
                buffer.writeByte(9)
                buffer.writeByte(8)
                break
        }
    } else {
        buffer.writeRrsInt32(cmd.id)
        switch (cmd.id) {
            case 201:
                buffer.writeIString(cmd.params.name)
                buffer.writeInt32(1)
                break
            case 205:
                buffer.writeInt32(cmd.params.id.high)
                buffer.writeInt32(cmd.params.id.low)
                buffer.writeByte(0)
                buffer.writeByte(0)
                break
            case 206:
                buffer.writeInt32(cmd.params.id.high)
                buffer.writeInt32(cmd.params.id.low)
                buffer.writeIString(cmd.params.name)
                buffer.writeRrsInt32(10)
                buffer.writeRrsInt32(cmd.params.badge)
                buffer.writeByte(0)
                buffer.writeByte(1)
                break
        }
    }

    console.log(buffer.buffer.slice(0, buffer.offset).toString('hex'))
    if (buffer) return buffer.buffer.slice(0, buffer.offset)
    else return false
}