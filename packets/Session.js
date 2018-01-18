const Crypto = require('../crypto')

function Session(client) {
    this.client = client
    this.crypto = new Crypto()
}

Session.prototype.send = function (code, payload, version = 0) {
    let crypted = this.crypto.encrypt(code, payload)
    let header = Buffer.alloc(7)
    header.writeUInt16BE(code, 0)
    header.writeUIntBE(crypted.length, 2, 3)
    header.writeUInt16BE(version, 5)

    this.client.write(Buffer.concat([header, crypted]))
    if (typeof packets[code].callback == 'function') packets[code].callback(this)
    console.log('#' + (this.user ? this.user.tag : ''), '[SERVER]', 'Sent ' + code)
}

Session.prototype.parse = function (code, buffer) {
    if (packets[code]) {
        if (typeof packets[code].decode == 'function') {
            try {
                let data = packets[code].decode(buffer)
                if (typeof packets[code].callback == 'function') packets[code].callback(this, data)
            } catch (e) {
                console.error('✖️ Error decoding ' + code + ' packet')
                console.log(e)
            }
        } else if (typeof packets[code].callback == 'function') packets[code].callback(this)
    }
}

module.exports = Session