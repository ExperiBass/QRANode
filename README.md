# QRANoDe

## A wrapper for ANUs Quantum RNG API.

See here for more info: https://anuquantumoptics.org/research-topics/qrng

[NPM Link](https://npmjs.com/package/qranode)


## Installation

`npm i qranode`

## Usage:

```js
const qranode = require('qranode')

// .then.catch
qranode({apiKey: "THIS_IS_A_KEY", dataType: 'uint8', amount: 5}) // get 5 numbers from 0 to 255
.then(console.log) // log the output
.catch(console.error) // or the errors, if any

// async/await
let numbers = await qranode({apiKey: "THIS_IS_A_KEY", dataType: 'uint8', amount: 5}) // get 5 numbers from 0 to 65535

// you can even get hex!

qranode({apiKey: "THIS_IS_A_KEY", dataType: 'hex16', amount: 5, blockSize: 2}) // get 5 hex strings, each string consisting of 2 hex blocks between 0000 and ffff
```

The API returns a JSON object with the success status, the type requested, the length of the array, and the array of numbers. The example below is the result of a request for two hex16 numbers with a block size of 4.

```js
{
  success: true,
  type: 'hex16',
  length: '2',
  data: [ '2f2497d207a39d67', 'dd537fa2b1c4c6b2' ]
}
```
