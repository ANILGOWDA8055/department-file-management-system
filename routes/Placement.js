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
const fastcsv = require("fast-csv");
var parse = require('csv-parse');
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
const uploadlocal = multer({ dest: 'uploads/' })

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

router.get('/placementcircular',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.pcircular;');
      res.render('Placement_circular',{zgs : results})
    })();
})
router.get('/ppacircular',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.ppacircular;');
      res.render('Ppa',{zgs : results})
    })();
})

router.get('/studentofferletter',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.soffer;');
      res.render('Students_offerletter',{zgs : results})
    })();
})

router.get('/unplaced',(req,res)=>{
    res.render('Unplaced');
})

router.post('/addpcircular',upload.single('pcircular'),(req,res) => {
    const a = req.body.pcname;
    const b = req.body.pcdate;
    const c = req.file.path;

    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.pcircular (cname,clink,cdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/placementcircular');
})
 
router.post('/addppacircular',upload.single('ppacircular'),(req,res) => {
    const a = req.body.pcname;
    const b = req.body.pcdate;
    const c = req.file.path;

    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.ppacircular (cname,clink,cdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
    });
    res.redirect('/ppacircular');
})


router.post('/newoffer',upload.single('sol'),(req,res) => {
    const a = req.body.sname;
    const b = req.body.susn;
    const c = req.file.path;
    const d = req.body.cname;
    const e = req.body.package;

    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.soffer (sname,susn,cname,package,offerletter) VALUES (?,?,?,?,?)",[a,b,d,e,c] , function (err, result, fields){
            if (err) throw err;
            
        }) 
    });
    res.redirect('/studentofferletter');
})




router.post('/addunplaced',uploadlocal.single('unplacedfile'),(req,res) => {
    let newpath = path.join(__dirname, '..', 'uploads',req.file.filename);
    let stream = fs.createReadStream(newpath);
    let csvData = [];
    let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
        csvData.push(data);
    })
    .on("end", function() {
    // remove the first line: header
    csvData.shift();
    con.connect(function(err){
        let query = 'INSERT INTO dept.unplaced (sname,susn) VALUES ?';   
        con.query(query, [csvData], (error, response) => {
            console.log(error || response);
        }); 
    });

});

stream.pipe(csvStream);
res.redirect('/unplaced');
})







module.exports = router;