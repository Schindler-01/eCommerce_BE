const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middleware
app.use(morgan("dev"))
// morgan("dev") color in status -> Bật khi dev mode
// morgan("combined") follow apache standard ->  Khi đưa lên production
// morgan("common") -> Gần giống combined nhưng k biết chạy bằng curl postman hay ...
// morgan("short") -> Ngắn hơn không có thời gian
// morgan("tiny") -> ngắn hơn nữa
app.use(helmet())
app.use(compression())


// init db

// init routers
app.get('/', (req, res, next) => {
  const strCompress = 'Hello Factipjs'

  return res.status(200).json({
    message: 'Hello!',
    metadata: strCompress.repeat(10000)
  })
})

// handling error


module.exports = app