const ByteBuffer = require('./services/network/bytebuffer-sc')

let b = ByteBuffer.allocate(10)

b.writeRrsInt32(225) // 2030

console.log(b.buffer.slice(0, b.offset).toString('hex'))

let b2 = ByteBuffer.fromHex('')
console.log(b2.readRrsInt32(),  b2.offset)

/*

*/