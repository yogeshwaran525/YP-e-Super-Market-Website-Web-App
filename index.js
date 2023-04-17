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

dotenv.config({
    path: "./.env",
  });


  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'login_crud'
})

db.connect((error)=>{
    if(!error){
        console.log('Database Connection Done');
    }else{
        console.log('Database Not Connected');
    }
})

app.use(cookieParser());

app.use(express.urlencoded({ extended : false}))
const filesspath =path.join(__dirname,"./public");
app.use(express.static(filesspath));

app.set('view engine','hbs');

const partialspath = path.join(__dirname +"/views/partials");
hbs.registerPartials(partialspath);

app.use('/',require('./pages/page'))

// Redirect to Folder router file auth.js module . exports
app.use("/auth",require("./routers/auth"))

app.listen(port,()=>{
    console.log('Server is listening Port : ' +`${port}`);
})