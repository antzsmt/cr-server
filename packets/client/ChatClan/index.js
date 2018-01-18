const ByteBuffer = require('../../../services/network/bytebuffer-sc')
const Redis = require('../../../services/redis')

module.exports.code = 14315

module.exports.decode = payload => {
    let buf = ByteBuffer.fromBinary(payload)

    return {
        message: buf.readIString()
    }
}

module.exports.callback = (session, data) => {
    if (!session.user.clan.tag) return false
    Redis.publisher.publish(
        'clan:' + session.user.clan.tag,
        `msg:${session.user.tag}:${session.user.nick}:${session.user.role}:${data.message}`
    )
    db.controllers.clan.addMessage(data.message, session.user)
}