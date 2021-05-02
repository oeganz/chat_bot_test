const express = require("express");
const app = express(); // create express app
const path = require('path')
const router = require('./router')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config()

//CORS HANDLER
var cors = require('cors')

app.use(cors())
app.options('*', cors());
//Init body parser for POST BODY JSON
app.use(bodyParser.json());

//DECLARE CACHE
app.set('sessionCache',{})

//MONGO CONNECTION
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
}).then(r => {
    console.log(`DB connected to ${process.env.MONGODB_URL}`)
}).catch(e=>{
    console.error(`error connect db ${process.env.MONGODB_URL}`)
    console.error(e)
})

// start express server on port 5000
app.listen(process.env.PORT, () => {
    console.log("server started on port "+process.env.PORT);
});

//SET ROUTE
app.use('/api',router)
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
