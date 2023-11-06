// mongo
const connectToMongo  = require('./db')
connectToMongo()

// express
const express = require('express')
const app = express()

app.use(express.json())
// setting router
app.use('/api/auth',require('./routes/auth'))

const port = 5000
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

