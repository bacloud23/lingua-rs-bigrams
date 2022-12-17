import protobuf from 'protobufjs' // respectively "./node_modules/protobufjs"
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

/**
 * @typedef  {Object} Ngram
 * @property {number} key
 * @property {string} value
 * @returns {{language: string, ngrams: Ngram[]}} myObj description
 */
function adjustEncode(oldData) {
    const newData = {
        "language": oldData['language'],
        "ngrams": []
    }
    newData.ngrams = Object.entries(oldData.ngrams)
    newData.ngrams = newData.ngrams.map(pair => {
        const key = pair[0].split('/').map(Number)
        const value = pair[1].split(' ')
        return {key, value}
    })
    return newData
}

protobuf.load("bigram.proto", function (err, root) {
    if (err)
        throw err;
    const data = require('./bigrams.json')
    const newFormat = adjustEncode(data)
    // console.log(newFormat)
    // example code
    const Message = root.lookupType("LinguaRs.Bigram");

    let message = Message.create(newFormat);
    // console.log(`message = ${JSON.stringify(message)}`);

    let buffer = Message.encode(message).finish();
    // console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

    let decoded = Message.decode(buffer);
    // console.log(`decoded = ${JSON.stringify(decoded)}`);
});