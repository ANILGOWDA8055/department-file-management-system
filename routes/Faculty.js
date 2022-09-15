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

router.get('/addfaculty',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.faculty;');
      res.render('Faculty',{zgs : results})
    })();
    
})

router.get('/addfacultycertificate',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.fcertificate;');
      res.render('Faculty_certificates',{xgs : results})
    })();
})
router.get('/fdpcertificate',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.fdpcertificate;');
      res.render('Fdp_certificate',{xgs : results})
    })();
})
router.get('/fachievement',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.fsuccess;');
      res.render('Faculty_achievement',{xgs : results})
    })();
})

router.get('/facultyprofile/:id',(req,res)=>{
    const a = req.params.id;
    (async () => {
        let results = await con.awaitQuery('select* from dept.faculty where fid = ?',[a]);
        let resultstwo = await con.awaitQuery('select* from dept.fcertificate where fid = ?',[a]);
        let resultsthree = await con.awaitQuery('select* from dept.fdpcertificate where fid = ?',[a]);
        let resultsfour = await con.awaitQuery('select* from dept.fsuccess where fid = ?',[a]);
        console.log(results);
        console.log(resultstwo);
        console.log(resultsthree);
        console.log(resultsfour);
        res.render('Faculty_profile',{ygs : results,lgs : resultstwo,sgs : resultsthree,mgs : resultsfour});
    })();
})

router.get('/profileedit/:id',(req,res)=>{
    const a = req.params.id;
    (async () => {
        let results = await con.awaitQuery('select* from dept.faculty where fid = ?',[a]);
        res.render('Faculty_edit',{zgs : results});
    })();
})

router.post('/newfaculty',upload.single('facultyletter'),(req,res) => {
    const a = req.body.facultyname;
    const b = req.body.facultyid;
    const c = req.file.path;
    const d = req.body.facultyphone;
    const e = req.body.facultymail;
    const f = req.body.picker;
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.faculty (fid,fname,fphone,fmail,fdesignation,fofferletter) VALUES (?,?,?,?,?,?)",[b,a,d,e,f,c] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);
    console.log(e);
    console.log(f);
    console.log('hi');
    res.redirect('/addfaculty');
})

router.post('/sendfacultycertificate',upload.single('Certificate'),(req,res) => {
    const a = req.body.fname;
    const b = req.body.fid;
    const c = req.file.path;
    const d = req.body.cdate;
    const e = req.body.cname;
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.fcertificate (fid,clink,cdate,fname,cname) VALUES (?,?,?,?,?)",[b,c,d,a,e,] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/addfacultycertificate');
})


router.post('/sendfdp',upload.single('fdpCert'),(req,res) => {
    const a = req.body.fname;
    const b = req.body.fid;
    const c = req.file.path;
    const d = req.body.cdate;
    const e = req.body.cname;
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.fdpcertificate (fid,clink,cdate,fname,cname) VALUES (?,?,?,?,?)",[b,c,d,a,e,] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);
    console.log(e);
    
    res.redirect('/fdpcertificate');
})


router.post('/sendsuccess',upload.single('fsuccess'),(req,res) => {
    const a = req.body.fname;
    const b = req.body.fid;
    const c = req.file.path;
    const d = req.body.cdate;
    const e = req.body.cname;
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.fsuccess (fid,clink,cdate,fname,cname) VALUES (?,?,?,?,?)",[b,c,d,a,e] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);
    console.log(e);
    
    res.redirect('/fachievement');
})

router.post('/editfaculty',(req,res) => {
    const a = req.body.fname;
    const b = req.body.fid;
    const c = req.body.fdesi;
    const d = req.body.fmail;
    const e = req.body.fmob;

    con.connect(function(err){
        var records = [a,c,b];
        con.query("update dept.faculty set fname=? , fphone=? ,fmail=?, fdesignation=? where fid=?",[a,e,d,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
    });
    res.redirect('/facultyprofile/'+b);
})



router.post('/facultydelete',(req,res) => {
    const a = req.body.cname;
    con.connect(function(err){
        con.query("delete from dept.faculty where fid = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/addfaculty');
})





module.exports = router;