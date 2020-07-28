/**
 * Fork of https://github.com/cbumgard/node-qrand
 *
 * Fork by: GingkathFox (Now known as ExperiBass)
 */


const Axios = require('axios')
const BASE = 'http://qrng.anu.edu.au/API/jsonI.php'
const LIMIT = 1024
const PREFIX = `[qrand:`

module.exports = getRandomNumber
/**
 * Get a random number from https://qrng.anu.edu.au/.
 * @param {string} type Must be either 'uint8', 'uint16', or 'hex16'.
 *
 * 'uint8' returns numbers between 0 and 255.
 *
 * 'uint16' returns numbers between 0 and 65535.
 *
 * 'hex16' returns hexadecimal characters between 00 and ff.
 * @param {number} amount The amount of numbers to get. Max array size is 1024.
 * @param {number} blockSize (Only used with 'hex16') The length of each hex block. Max block size is 1024.
 */
async function getRandomNumber(type = 'hex16', amount = 1, blockSize = 1) {
    const VALID_TYPES = [
        'uint8',
        'uint16',
        'hex16'
    ]
    if (!VALID_TYPES.includes(type)) {
        type = 'uint8'
        console.warn(`${PREFIX}Warning] | The "type" argument must be one of these: ${VALID_TYPES.join(', ')}\nResetting type to "uint8".`)
    }
    if (amount < 1) {
        console.warn(`${PREFIX}Warning] | The "amount" argument can't be less than one. Resetting amount to one.`)
        amount = 1
    }
    if (blockSize < 1) {
        console.warn(`${PREFIX}Warning] | The "blockSize" argument can't be less than one. Resetting blockSize to one.`)
        blockSize = 1
    }
    // set up the rest of the url and check `amount` and `blockSize`
    let args = `?type=${type}&length=${amount > LIMIT ? amount = LIMIT : amount}${type = 'hex16' ? `&size=${blockSize > LIMIT ? blockSize = LIMIT : blockSize}` : ''}`

    // Time to get the data!
    try {
        let response = await Axios.get(`${BASE}${args}`)
        return response.data.data
    } catch (e) {
        throw e
    }
}

getRandomNumber('uint8', 5)
.then(console.log)