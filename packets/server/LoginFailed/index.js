const fingerPrint = JSON.stringify(require('../../../services/http/fingerprint'))
const ByteBuffer = require('../../../services/network/bytebuffer-sc')

module.exports.code = 20103

module.exports.encode = reason => {
    let buffer
    switch(reason){
        case 'updateContent':
        buffer = ByteBuffer.allocate(2000)
        buffer.writeByte(7)
        buffer.writeIString(fingerPrint)
        buffer.writeIString('')
        buffer.writeIString('http://an.rcq.com')
        buffer.writeIString('')
        buffer.writeByte(0)
        buffer.writeByte(0)
        buffer.writeIString('')
        buffer.writeByte(2)
        buffer.writeIString('http://game-assets.clashroyaleapp.com')
        buffer.writeIString(`http://${config.content.host}:${config.content.port}`)
    }
    return buffer.buffer.slice(0, buffer.offset)
}