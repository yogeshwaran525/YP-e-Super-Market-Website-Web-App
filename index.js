const express = require('express');
const hbs = require('hbs');
const path = require('path');
const port = 3000;
const mysql = require('mysql')
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require('body-parser');  
// Parsing middleware
// app.use(express.urlencoded({ extended : true }));
// app.use(express.json()); // New
// Password and some information store in .env file
dotenv.config({ path: "./.env", });
app.use(cookieParser());
app.use(express.urlencoded({ extended : false}))
app.use(express.json())
// Static file Public folder
const filesspath =path.join(__dirname,"./public");
app.use(express.static(filesspath));
// hbs view engine and html files in hbs file
app.set('view engine','hbs');
// Header and Footer static files all pages used in {{>header}} or {{>footer}}
const partialspath = path.join(__dirname +"/views/partials");
hbs.registerPartials(partialspath);
// Pages File
app.use('/',require('./pages/page'))
// Redirect to Folder router file auth.js module . exports
app.use("/auth",require("./routers/auth"))
// Port Number Listening
app.listen(port,()=>{
    console.log('Server is listening Port : ' +`${port}`);
})
