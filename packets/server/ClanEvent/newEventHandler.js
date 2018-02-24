const events = require('../../../logic/clans/entriesIds.json')
const tag2id = require('../../../logic/utils/tag2id')

module.exports = (session, channel, message) => {
    let command = message.split(':')
    switch (command[0]) {
        case 'joined':
            session.send(packets.ClanEvent.code, packets.ClanEvent.encode({
                id: events.MEMBER_ACTION.code,
                actionType: events.MEMBER_ACTION.JOINED,
                player: {
                    tagId: tag2id.tag2id(command[1]),
                    nick: command[2]
                }
            }))
            break
        case 'left':
            session.send(packets.ClanEvent.code, packets.ClanEvent.encode({
                id: events.MEMBER_ACTION.code,
                actionType: events.MEMBER_ACTION.LEFT,
                player: {
                    tagId: tag2id.tag2id(command[1]),
                    nick: command[2]
                }
            }))
            break
        case 'promoted':
            session.send(packets.ClanEvent.code, packets.ClanEvent.encode({
                id: events.MEMBER_ACTION.code,
                actionType: events.MEMBER_ACTION.PROMOTED,
                player: {
                    tagId: tag2id.tag2id(command[1]),
                    nick: command[2]
                },
                initiator: {
                    nick: command[3]
                }
            }))
            break
        case 'demoted':
            session.send(packets.ClanEvent.code, packets.ClanEvent.encode({
                id: events.MEMBER_ACTION.code,
                actionType: events.MEMBER_ACTION.DEMOTED,
                player: {
                    tagId: tag2id.tag2id(command[1]),
                    nick: command[2]
                },
                initiator: {
                    nick: command[3]
                }
            }))
            break
        case 'msg':
            session.send(packets.ClanEvent.code, packets.ClanEvent.encode({
                id: events.MESSAGE,
                message: command[4],
                player: {
                    tagId: tag2id.tag2id(command[1]),
                    nick: command[2],
                    role: parseInt(command[3])
                }
            }))
            break
    }
}