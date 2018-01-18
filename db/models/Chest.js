const chests = require('../cards.json')

function Chest(params) {
    this.id = params.id
    this.legendaryChance = params.legendaryChance ? params.legendaryChance : 0.1 
    this.minCards = params.minCards
    this.requiredSpecial = params.requiredSpecial ? params.requiredSpecial : 0
    this.requiredEpic = params.requiredEpic ? params.requiredSpecial : 0
    this.exclusiveType = params.exclusiveType ? params.exclusiveType : false
    this.gold = params.gold ? params.gold : 0
    this.gems = params.gems ? params.gems : 0
    this.clicks = params.clicks ? params.clicks : 3
}

Chest.prototype.open = function () {
    let rewards = {
        gems: this.gems,
        cards: []
    }
    rewards.gold = typeof params.gold == 'object' ? '' : params.gold

    if(this.exclusiveType) {

    } else {

    }
    
    return rewards
}