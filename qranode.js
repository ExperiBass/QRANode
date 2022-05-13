/**
 * Fork of https://github.com/cbumgard/node-qrand
 * Fork by: GingkathFox (Now known as ExperiBass)
 */
'use strict'
//const fetch = require('fetch')
const Axios = require('axios')
const BASE_URL = 'http://qrng.anu.edu.au/API/jsonI.php'
const LIMIT = 1024
const VALID_TYPES = [
    'uint8',
    'uint16',
    'hex16'
]
const {
    prettifiedName
} = require('./package.json')
function warning(msg) {
    console.warn(`[${prettifiedName}:Warning] | ${msg}`)
}

/**
 * Get a random number from https://qrng.anu.edu.au/.
 * @async
 * @param {string} [type] - Must be either `uint8`, `uint16`, or `hex16`. Defaults to `uint8`.
 *
 * - `uint8` - returns numbers between 0 and 255.
 *
 * - `uint16` - returns numbers between 0 and 65535.
 *
 * - `hex16` - returns hexadecimal characters between `00` and `ff`.
 * Each block is two bytes.  
 * For example, if you set `blockSize` to `4`, it would return hex between `00000000` and `ffffffff`.
 *
 * @param {number} [amount] - The amount of numbers to get. Max array size is `1024`. defaults to 1.
 * @param {number} [blockSize] - The length of each hex block. Max block size is `1024`.  
 * Only used with `hex16`, if the `type` argument is different this doesn't matter.
 * @returns {number[]|string[]} - An array of numbers if `uint8` or `uint16` were chosen, else an array of hexadecimal strings.
 */
async function getRandomNumbers(dataType = "uint8", amount = 1, blockSize = 1) {

    // shift to lowercase
    dataType = dataType.toLowerCase()

    // do a quick validation, requesting negative numbers from
    // a quantum void would probably end the world
    if (!VALID_TYPES.includes(dataType)) {
        warning(`The "dataType" argument must be one of these: ${VALID_TYPES.join(', ')}\nResetting type to "uint8".`)
        dataType = 'uint8'
    }
    if (amount < 1) {
        warning(`The "amount" argument can't be less than one. Resetting amount to one.`)
        amount = 1
    }
    if (blockSize < 1) {
        warning(`The "blockSize" argument can't be less than one. Resetting blockSize to one.`)
        blockSize = 1
    }

    // now make sure the "amount" argument isn't too large
    if (amount > LIMIT) {
        warning(`The "amount" argument is larger than the limit of ${LIMIT}. Resetting to ${LIMIT}.`)
        amount = LIMIT
    }
    // define the args first
    let args = `?type=${dataType}&length=${amount}`

    // and if the user wants hexadecimal, make sure the blockSize is not too large either
    if (dataType === 'hex16') {
        if (blockSize > LIMIT) {
            warning(`The "blockSize" argument is larger than the limit of ${LIMIT}. Resetting to ${LIMIT}.`)
            blockSize = LIMIT
        }
        args += `&size=${blockSize}`
    }

    // Time to get the data!
    try {
        const response = (await Axios.get(`${BASE_URL}${args}`)).data
        // ^ extract the data from the Axios response
        return response
    } catch (e) {
        throw e
    }
}

module.exports = getRandomNumbers