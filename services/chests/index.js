const chests = require('../../logic/chests.json')
const Random = require('./random')
const rarities = require('../../logic/rarities')

let cards = require('../../logic/cards')
const cardsJSON = JSON.stringify({
    common: cards.common,
    rare: cards.rare,
    epic: cards.epic,
    legendary: cards.legendary
}) // Until i find a better way to clone without reference

module.exports.open = (id, shop = false) => {
    let cardsPool = JSON.parse(cardsJSON) // Clone cards
    let chest = chests.rewards[id]

    let rewards = { gold: chest.gold, gems: chest.gems, cards: [] }
    if (shop) rewards.price = chest.price
    if (chest.draft) rewards.draft = true

    if (chest.schemas.length) {
        // Random schema
        let schema = Random.element(chest.schemas)

        // Count clicks for each card
        let counts = []
        schema.forEach(x => counts[x] = (counts[x] || 0) + 1)

        // Generate random number for click and sum all
        for (let x in counts) {
            let rand = { sum: 0, vals: [] }
            for (let i = 0; i < counts[x]; i++) {
                let n = Random.number(1, 50)
                rand.vals.push(n)
                rand.sum += n
            }
            counts[x] = rand
        }

        // Assign cards to each click
        for (let click of schema) {
            let rand = counts[click].vals.shift()
            let rarity = rarities[click]
            let quantity = Math.ceil((rand / counts[click].sum) * chest.cards[rarity]) // Reduce random
            let card = Random.elementShift(cardsPool[rarity])

            rewards.cards.push({ id: card.id, quantity: quantity })
            if (chest.draft) rewards.cards.push({ id: Random.elementShift(cardsPool[rarity]).id, quantity: quantity })
        }

    }

    // Epic ?
    if (chest.cards.epicChance) {
        let epic = Math.random() < chest.cards.epicChance
        if (epic) {
            rewards.cards.push({ id: Random.elementShift(cardsPool['epic']).id, quantity: 1 })
            if (chest.draft) rewards.cards.push({ id: Random.elementShift(cardsPool['epic']).id, quantity: 1 })
        }
    }
    // Legendary ?
    let legendary = chest.cards.legendaryChance === 1 || Math.random() < chest.cards.legendaryChance
    if (legendary) {
        rewards.cards.push({ id: Random.elementShift(cardsPool['legendary']).id, quantity: 1 })
        if (chest.draft) rewards.cards.push({ id: Random.elementShift(cardsPool['legendary']).id, quantity: 1 })
    }

    return rewards

}