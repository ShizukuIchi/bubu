const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const getResult = require('./main').getResult
const PORT = process.env.PORT || 5000

express()
  .use(bodyParser.json())
  .get("/", function(req, res){
    res.sendFile(path.resolve(__dirname, "./views/index.html"))
  })
  .post("/getResult", getResult) // req { time <string>, from <string> }
  .listen(PORT, () => console.log(`Server running on ${ PORT }`))
