const arenas = require('../arenas.json')

module.exports.arena = trophies => {
    let arena = 1
    for (let i in arenas) {
        if (trophies >= arenas[i].trophies) {
            arena = arenas.length - i
            break
        }
    }

    return arena
}