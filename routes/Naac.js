require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');
const fs = require(`fs`);
const mysql = require(`mysql-await`);
//const { urlencoded } = require('body-parser');
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
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

router.get('/naaccircular',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.naaccircular;');
      res.render('Naac_circular',{Egs : results})
    })();
    
})

router.get('/naaccriteria',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.naaccriteria;');
      res.render('Naac_criteria_files',{Fgs : results})
    })();
})

router.get('/nirf',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.nirf;');
      res.render('Nirf',{xgs : results})
    })();
})




router.post('/naacaddcircular',upload.single('circularfile'),(req,res) => {
    console.log(req.body);
    const n = req.body.circularname;
    const d = req.body.circulardate;
    const l = req.file.path;
    
    
    con.connect(function(err){
        var records = [n,d,l];
        con.query("insert into dept.naaccircular (cirname,cirlink,cirdate) VALUES (?,?,?)",[n,l,d] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(n);
    console.log(l);
    console.log(d);
    res.redirect('/naaccircular');
})

router.post('/addnirf',upload.single('nirffile'),(req,res) => {
    const a = req.body.cname;
    const b = req.body.cdate;
    const c = req.file.path;


    con.connect(function(err){
        con.query("insert into dept.nirf (cname,cdate,clink) VALUES (?,?,?)",[a,b,c] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/nirf');

})


router.post('/naacaddcriteria',upload.single('circularfile'),(req,res) => {
    const a = req.body.circularname;
    const b = req.body.circulardate;
    const c = req.file.path;
    
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.naaccriteria (cirname,cirlink,cirdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    res.redirect('/naaccriteria');
})


router.post('/naaccirdelete',upload.single('circularfile'),(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.naaccircular where cirname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/naaccircular');
})

router.post('/naaccriteriadelete',upload.single('circularfile'),(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.naaccriteria where cirname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/naaccriteria');
})

module.exports = router;