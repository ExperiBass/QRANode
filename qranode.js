/**
 * Fork of https://github.com/cbumgard/node-qrand
 * Fork by: ExperiBass
 */

'use strict'

const Axios = require('axios')
const BASE_URL = 'https://api.quantumnumbers.anu.edu.au'
const LIMIT = 1024
const BLOCK_LIMIT = 10
const VALID_TYPES = [
    'uint8',
    'uint16',
    'hex8',
    'hex16'
]
const {
    prettifiedName,
    name,
    version
} = require('./package.json')
function warning(msg) {
    console.warn(`[${prettifiedName}:Warning] | ${msg}`)
}

/**
 * Get a random number from https://quantumnumbers.anu.edu.au.
 * @async
 * @param {Object} args
 * @param {String} args.apiKey - Your API key.
 * @param {String} [args.dataType] - Must be either `uint8`, `uint16`, or `hex16`. Defaults to `uint8`.
 *
 * - `uint8` - returns numbers between 0 and 255.
 *
 * - `uint16` - returns numbers between 0 and 65535.
 *
 * - `hex8` - returns hexadecimal numbers between `00` and `ff`.
 * 
 * - `hex16` - returns hexadecimal numbers between `0000` and `ffff`.
 * Each block is two bytes.  
 * For example, if you set `blockSize` to `4`, it would return hex between `00000000` and `ffffffff`.
 *
 * @param {Number} [args.amount] - The amount of numbers to get. Max array size is `1024`. defaults to 1.
 * @param {Number} [args.blockSize] - The length of each hex block. Max block size is `1024`.  
 * Only used with `hex8` and `hex16`, if the `type` argument is different this doesn't matter.
 * @returns {Object} 
 */
async function getRandomNumbers({apiKey, dataType = "uint8", amount = 1, blockSize = 1}) {

    // if theres no API key, don't bother doing anything else
    if (!apiKey) {
        throw Error(`The "apiKey" argument is required.`)
    }
    // set the headers
    const HEADERS = {}
    HEADERS["x-api-key"] = apiKey
    HEADERS["x-user-agent"] = `${name}-v${version}`
    
    // now, start the actual request

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
    if (dataType === 'hex16' || dataType === 'hex8') {
        if (blockSize > BLOCK_LIMIT) {
            warning(`The "blockSize" argument is larger than the limit of ${BLOCK_LIMIT}. Resetting to ${BLOCK_LIMIT}.`)
            blockSize = BLOCK_LIMIT
        }
        args += `&size=${blockSize}`
    }

    // Time to get the data!
    try {
        const response = (await Axios.get(`${BASE_URL}${args}`, {
            headers: HEADERS
        })).data
        // ^ extract the data from the Axios response
        return response
    } catch (e) {
        throw e
    }
}

module.exports = getRandomNumbers