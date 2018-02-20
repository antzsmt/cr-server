const mongoose = require('mongoose')
const tag2id = require('../../logic/utils/tag2id')

const schema = new mongoose.Schema({
    tag: { type: String, required: true, unique: true },
    nick: { type: String, default: 'AN', required: true },
    tagId: {
        high: { type: Number },
        low: { type: Number }
    },
    pass: { type: String, required: true },
    cards: { type: mongoose.Schema.Types.Mixed },
    decks: [{
        cards: [{ type: Number }],
    }],
    chests: [{
        id: { type: Number },
        slot: { type: Number, max: 4, min: 1 },
        status: { type: Number, default: 1 }
    }],
    resources: {
        gold: { type: Number, max: 1000000, default: 1000000 },
        gems: { type: Number, default: 1000000 },
        currentDeck: { type: Number, min: 0, max: 4, default: 0 }
    },
    stats: {
        trophies: { type: Number, default: 2800 },
        arena: { type: Number, default: 9 },
        record: { type: Number, default: 2800 },
        battles: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        loses: { type: Number, default: 0 },
        level: { type: Number, default: 4, max: 13, min: 1 },
        exp: { type: Number, default: 0 },
    },
    clan: {
        tag: { type: String },
        name: { type: String },
        badge: { type: Number },
        role: { type: Number, min: 1, max: 4}
    },
    registeredTime: { type: Date, default: Date.now }
}, {
    usePushEach: true
})

schema.post('validate', (doc, next) => {
    doc.tagId = tag2id.tag2id(doc.tag)

    if (!doc.decks || doc.decks.length < 1)
        doc.decks = defaults.decks

    if (!doc.cards)
        doc.cards = defaults.cards

    next()
})

const User = mongoose.model('players', schema)

const defaults = {
    decks: [
        {
            cards: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            cards: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            cards: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            cards: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            cards: [1, 2, 3, 4, 5, 6, 7, 8],
        }
    ],
    cards: {
        1: [7, 184],
        2: [7, 191],
        3: [7, 225],
        4: [5, 32],
        5: [2, 2],
        6: [8, 13],
        7: [2, 2],
        8: [2, 1],
        9: [4, 15]
    }
}

module.exports = User
