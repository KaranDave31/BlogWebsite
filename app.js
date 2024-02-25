//express server

// console.log("Hello worlds");

require('dotenv').config();

const exp = require("constants");
const path = require("path");


const express = require("express");
const expressLayout = require('express-ejs-layouts');

const app = express();
const port = 3000 || process.env.PORT;

//templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine' ,'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./server/routes/main'));




app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})