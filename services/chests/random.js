const number = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
module.exports.number = number

module.exports.element = array => array[number(0, array.length - 1)]

module.exports.elementShift = array => array.splice(number(0, array.length - 1), 1)[0]

/*
 * https://stackoverflow.com/a/12646864/7411975
*/
module.exports.shuffle = array => {
    let out = [].concat(array)
    for (let i = out.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }

    return out
}