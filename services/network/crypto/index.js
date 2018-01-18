const RC4 = require('simple-rc4')
const key = Buffer.from('fhsd6f86f67rt8fw78fw789we78r9789wer6re' + 'nonce', 'utf8')

function Crypto() {
    this.clientStream = new RC4(key)
    this.clientStream.update(Buffer.from(key))
    this.serverStream = new RC4(key)
    this.serverStream.update(Buffer.from(key))

    this.rc4 = true // Set for encrypting 20103 on content update after rc4 patching
}

Crypto.prototype.decrypt = function (message) {
    switch (message.code) {
        case 10100:
            this.rc4 = false
            return message.payload
        default:
            return this.clientStream.update(message.payload)
    }
}

Crypto.prototype.encrypt = function (code, payload) {
    if (code === 20100 || (code === 20103 && this.rc4 === false))
        return payload
    else
        return this.serverStream.update(payload)
}

module.exports = Crypto
