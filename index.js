const express = require('express');
const app = express();
require('dotenv').config()
const session = require('express-session');
app.use(session({secret:'secret',resave: true,
saveUninitialized: true}))
app.use(function(req, res, next) {
    res.locals.usn = req.session.usn;
    next();
  });

const fs = require(`fs`);
const mysql = require(`mysql-await`);
//const { urlencoded } = require('body-parser');


const fastcsv = require("fast-csv");




const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const aicteroute = require('./routes/Aicte');
app.use('/',aicteroute);
const vturoute = require('./routes/Vtu');
app.use('/',vturoute);
const nbaroute = require('./routes/Nba');
app.use('/',nbaroute);
const naacroute = require('./routes/Naac');
app.use('/',naacroute);
const industryroute = require('./routes/Industry_collaboration');
app.use('/',industryroute);
const alumniroute = require('./routes/Alumni');
app.use('/',alumniroute);
const facultyroute = require('./routes/Faculty');
app.use('/',facultyroute);
const placementroute = require('./routes/Placement');
app.use('/',placementroute);
const loginroute = require('./routes/Login');
app.use('/',loginroute);

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sujanya@1978",
    database: "dept"
});

con.connect((err) => {
    if (!err) {
        console.log("Connected");
    }
    else {
        console.log(err)
    }
})


app.get('/', (req, res) => {
    res.render('Homepage')
})
app.listen(8000, () => {
    console.log('Serving on port 8000')
})