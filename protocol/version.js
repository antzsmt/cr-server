const fingerprintSha = require('../services/http/fingerprint').sha

module.exports.updateContent = (session, json) => {
    if (json.resourceSha != fingerprintSha)
        session.send(packets.LoginFailed.code, packets.LoginFailed.encode('updateContent'), 4)
    else {
        session.send(packets.HandshakeOk.code, packets.HandshakeOk.encode())
    }
}