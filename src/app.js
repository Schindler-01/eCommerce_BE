require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const { Web3 } = require('web3')
const cosmwasm = require("@cosmjs/cosmwasm-stargate");
const { CONTRACT_ADDR, CONFIG, CHAIN_CONFIG, LIST_RPC_ORAI_CHAIN } = require("./configs/configAddress");
const cors = require("cors")
const ethers = require('ethers')

const web3 = new Web3(CHAIN_CONFIG.ETH.PROVIDER);

app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(cors())

let PRIVATE_KEY = "";

let clients = [];
const initApp = async () => {
  for (let i = 0; i < LIST_RPC_ORAI_CHAIN.length; i++) {
    try {
      let client = await cosmwasm.CosmWasmClient.connect(LIST_RPC_ORAI_CHAIN[i]);
      clients.push(client);
    } catch (err) {
      console.log(err.toString());
    }
  }

  var readline = require('readline');

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.stdoutMuted = true;

  rl.question('PRIVATE_KEY: ', function (private_key) {
    PRIVATE_KEY = private_key;
    rl.close();
  });

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted)
      rl.output.write("*");
    else
      rl.output.write(stringToWrite);
  };
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const queryExchangeRate = async () => {
  let numberCall = 0;
  let done = 0;
  let queryResult = {};

  if (clients.length == 0) {
    throw ("Cannot connect to RPC")
  }

  clientIndex = clients.length;
  while (!done && numberCall < 10) {
    try {
      numberCall++;
      queryResult = await clients[(clientIndex = (clientIndex + 1) % clients.length)].queryContractSmart(CONTRACT_ADDR.LSD_HUB_ORAICHAIN, {
        state: {},
      });
      done = 1;
    } catch (err) {
      console.log(err.toString());
    }
  }
  if (numberCall >= 10) {
    throw "Cannot connect to RPC";
  }

  return Math.round((queryResult.sc_exchange_rate) * CONFIG.DECIMAL_PLACE)
};

const getUnixTimeNow = () => {
  return Math.floor(new Date().getTime() / 1000) + 300;
}

// init routers
app.get('/signature', async (req, res, next) => {
  try {
    const getExchangeRate = await queryExchangeRate();
    const data = {
      timeStamp: getUnixTimeNow(),
      exchangeRate: getExchangeRate
    };

    const dataToSign = web3.utils.soliditySha3(
      { type: 'uint256', value: data.timeStamp },
      { type: 'uint256', value: data.exchangeRate },
    );

    const { signature } = web3.eth.accounts.sign(dataToSign, PRIVATE_KEY)

    let utf8Bytes = ethers.utils.toUtf8Bytes(signature)

    console.log({
      inforExchangeRare: data,
      signature,
      // utf8Bytes: uint8ArrayToArray(utf8Bytes)
    });

    return res.status(200).json({
      inforExchangeRare: data,
      signature: signature,
      // utf8Bytes: uint8ArrayToArray(utf8Bytes)
    })
  } catch (err) {
    console.log(err);
    res.status(502).send({
      message: err.toString()
    });
  }
});

function uint8ArrayToArray(uint8Array) {
  var array = [];

  for (var i = 0; i < uint8Array.byteLength; i++) {
    array[i] = uint8Array[i];
  }

  return array;
}

module.exports = { initApp, app }

