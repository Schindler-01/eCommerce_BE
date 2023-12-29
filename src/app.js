require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const { Web3 } = require('web3')
const cosmwasm = require("@cosmjs/cosmwasm-stargate");
const { CONTRACT_ADDR, CONFIG, CHAIN_CONFIG } = require("./configs/configAddress");
const cors = require("cors")

const web3 = new Web3(CHAIN_CONFIG.ETH.PROVIDER);

let PRIVATE_KEY = "";

const getPassWord = () => {
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

// init middleware
app.use(morgan("dev"))
// morgan("dev") color in status -> Bật khi dev mode
// morgan("combined") follow apache standard ->  Khi đưa lên production
// morgan("common") -> Gần giống combined nhưng k biết chạy bằng curl postman hay ...
// morgan("short") -> Ngắn hơn không có thời gian
// morgan("tiny") -> ngắn hơn nữa
app.use(helmet())
app.use(compression())
app.use(cors())
// init db
// require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

const queryExchangeRate = async () => {
  const client = await cosmwasm.SigningCosmWasmClient.connect(
    "https://rpc.orai.io"
  );
  const queryResult = await client.queryContractSmart(CONTRACT_ADDR.LSD_HUB_ORAICHAIN, {
    state: {},
  });
  return Math.round((queryResult.sc_exchange_rate) * CONFIG.DECIMAL_PLACE)
};

const getUnixTimeNow = () => {
  return Math.floor(new Date().getTime() / 1000) + 300;
}

// init routers
app.get('/signature', async (req, res, next) => {
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
  console.log({
    inforExchangeRare: data,
    signature
  });

  return res.status(200).json({
    inforExchangeRare: data,
    signature
  })
});

module.exports = {getPassWord, app}

