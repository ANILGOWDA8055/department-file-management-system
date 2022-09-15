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
const fastcsv = require("fast-csv");
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

router.get('/mous',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.mou;');
      res.render('Mou',{Ggs : results})
    })();
    
})

router.get('/consult',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.consult;');
      res.render('Consultancy_files',{Hgs : results})
    })();
    
})

router.get('/internship',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.internship;');
      res.render('Internship',{xgs : results})
    })();
    
})


router.post('/addinternship',upload.single('ioffer'),(req,res) => {
    const a = req.body.sname;
    const b = req.body.susn;
    const c = req.body.cname;
    const d = req.body.dur;
    const e = req.body.stipend;
    const f = req.file.path;


    con.connect(function(err){
        con.query("insert into dept.internship (sname,susn,cname,duration,stipend,ioffer) VALUES (?,?,?,?,?,?)",[a,b,c,d,e,f] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });

    res.redirect('/internship');

})






router.post('/addmou',upload.single('circularfile'),(req,res) => {
    const n = req.body.circularname;
    const d = req.body.circulardate;
    const l = req.file.path;
    
    
    con.connect(function(err){
        var records = [n,d,l];
        con.query("insert into dept.mou (cname,files,cirdate) VALUES (?,?,?)",[n,l,d] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(n);
    console.log(l);
    console.log(d);
    res.redirect('/mous');
})

router.post('/addconsultancy',upload.single('circularfile'),(req,res) => {
    const a = req.body.circularname;
    const b = req.body.circulardate;
    const c = req.file.path;
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.consult (cname,clink,cdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    res.redirect('/consult');
})


router.post('/moudelete',upload.single('circularfile'),(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.mou where cname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/mous');
})

router.post('/consultdelete',upload.single('circularfile'),(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.consult where cname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/consult');
})

module.exports = router;