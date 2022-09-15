const { constants } = require('buffer');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');
app.use(session({secret:'secret',resave: true,
saveUninitialized: true
}))
const { v4: uuidv4 } = require('uuid');
uuidv4();

const fs = require(`fs`);
const mysql = require(`mysql-await`);
const { urlencoded } = require('body-parser');

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

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

router.get('/nbacircular',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.nbacircular;');
      res.render('Nba_circular',{Cgs : results})
    })();
    
})

router.get('/nbacriteria',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.nbacriteria;');
      res.render('Nba_criteria_files',{Dgs : results})
    })();
    
})





router.post('/nbaaddcircular',upload.single('circularfile'),(req,res) => {
    const n = req.body.circularname;
    const d = req.body.circulardate;
    const l = req.file.path;
    
    
    con.connect(function(err){
        var records = [n,d,l];
        con.query("insert into dept.nbacircular (cirname,cirlink,cirdate) VALUES (?,?,?)",[n,l,d] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(n);
    console.log(l);
    console.log(d);
    res.redirect('/nbacircular');
})

router.post('/nbaaddcriteria',upload.single('circularfile'),(req,res) => {
    const a = req.body.circularname;
    const b = req.body.circulardate;
    const c = req.file.path;
    
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.nbacriteria (cirname,cirlink,cirdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    res.redirect('/nbacriteria');
})

module.exports = router;