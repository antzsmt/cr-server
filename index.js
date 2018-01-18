const net = require('net')
const chalk = require('chalk')
const Packetizer = require('./services/network/packetizer')
const Session = require('./packets/Session')
const fs = require('fs')

config = require('./config')
packets = {}
clients = {}

require('./db')
require('./services/http')

const server = new net.Server()

fs.readdir('./packets/client', (err, files) => {
    files.forEach(file => {
        let packet = require(`./packets/client/${file}`)
        packets[packet.code] = Object.assign({
            name: file
        }, packet)
        packets[file] = packet
    })

    fs.readdir('./packets/server', (err, files) => {
        files.forEach(file => {
            let packet = require(`./packets/server/${file}`)
            packets[packet.code] = Object.assign({
                name: file
            }, packet)
            packets[file] = packet
        })
    })
})

server.on('connection', client => {
    console.log('[SERVER]', chalk.blue('Client connected'))
    let packetizer = new Packetizer()
    client.session = new Session(client)

    client.on('data', chunk => {
        packetizer.packetize(chunk, (packet) => {
            let message = {
                code: packet.readUInt16BE(0),
                length: packet.readUIntBE(2, 3),
                payload: packet.slice(7, packet.length)
            }

            console.log('[SERVER]', chalk.blue('Received message ' + message.code))
            client.session.parse(message.code, client.session.crypto.decrypt(message))
        })
    })

    client.on('end', async () => {
        console.error('[CLIENT]', chalk.yellow('Client disconnected'))
        if (client.session.redis) await client.session.redis.disconnect()
        if (client.session.battle && client.session.battle.hearBeat) clearInterval(client.session.battle.hearBeat)
        delete client.session
    })

    client.on('error', async error => {
        try {
            console.error('[ERROR]', chalk.red(error.message))
            if (client.session && client.session.redis) await client.session.redis.disconnect()
            if (client.session.battle && client.session.battle.hearBeat) clearInterval(client.session.battle.hearBeat)
            delete client.session
            client.destroy()
        } catch (e) { }
    })
})

server.once('listening', () => console.log('[SERVER]', chalk.green('Listening on 9339')))
server.listen(9339)

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise')
    console.log(p)
    console.log(' => reason:', reason)
})

process.once('SIGINT', () => {
    process.kill(process.pid, 'SIGKILL')
})

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGKILL')
})