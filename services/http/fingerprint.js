
const fs = require('fs')
const checksum = require('sha1-file')
const crypto = require('crypto')
const path = './services/http/files'
let files = []

let strSha1 = str => crypto.createHash('sha1')
        .update(str, 'utf8')
        .digest('hex')
        
let readRecursive = dir => {
    let folders = fs.readdirSync(dir)
    folders.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            readRecursive(dir + '/' + file)
        } else {
            files.push(dir.replace(path, '') + '/' + file)
        }
    })
}
readRecursive(path)

let filesChecksumed = files.map(file => {
    return {
        file: file,
        sha: checksum(path + '/' + file)
    }
})

module.exports = {
    files: filesChecksumed,
    sha: strSha1(filesChecksumed.map(file => file.sha).join()),
    version: config.content.version
}
