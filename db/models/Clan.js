
const mongoose = require('mongoose')
const tag2id = require('../../logic/utils/tag2id')

const schema = new mongoose.Schema({
    tag: { type: String, required: true, unique: true },
    name: { type: String, default: 'RCQ', required: true },
    tagId: {
        high: { type: Number },
        low: { type: Number }
    },
    members: { type: mongoose.Schema.Types.Mixed },
    memberCount: { type: Number, default: 1 },
    info: {
        trophies: { type: Number, default: 0 },
        requiredTrophies: { type: Number, default: 0 },
        donations: { type: Number, default: 0 },
        region: { type: Number, default: 215 },
        access: { type: Number, default: 1 },
        description: { type: String, default: '' },
        badge: { type: Number, default: 55 }
    },
    chat: [{ type: Array }]
}, {
        usePushEach: true
    })

schema.post('validate', (doc, next) => {
    doc.tagId = tag2id.tag2id(doc.tag)

    next()
})

schema.post('find', docs => {
    /*
    for (let doc of docs) {
        for (let entry in doc.chat) {
            let mapped = {}
            let id = doc.chat[entry][0]
            let keys = Object.keys(entry)
            for (let i in keys) {
                mapped[keys[i]] = maps.chat[id][i]
            }
            doc.chat[entry] = mapped
        }
    }*/
})

const Clan = mongoose.model('clans', schema)

const maps = {
    chat: {
        2: ['id', 'tag', 'message', 'name', 'role', 'time']
    }
}


module.exports = Clan