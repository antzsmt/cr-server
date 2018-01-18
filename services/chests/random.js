const number = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
module.exports.number = number

module.exports.element = array => array[number(0, array.length - 1)]

module.exports.elementShift = array => array.splice(number(0, array.length - 1), 1)[0]