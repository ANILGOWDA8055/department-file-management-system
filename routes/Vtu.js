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

router.get('/vtucircular',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.vtucircular;');
      res.render('Vtu_circular',{Ags : results})
    })();
    
})

router.get('/vtuapproval',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.vtuapproval;');
      res.render('Vtu_Approval_Letters',{Bgs : results})
    })();
    
})





router.post('/vtuaddcircular',upload.single('circularfile'),(req,res) => {
    const n = req.body.circularname;
    const d = req.body.circulardate;
    const l = req.file.path;
    
    
    con.connect(function(err){
        var records = [n,d,l];
        con.query("insert into dept.vtucircular (cirname,cirlink,cirdate) VALUES (?,?,?)",[n,l,d] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(n);
    console.log(l);
    console.log(d);
    res.redirect('/vtucircular');
})

router.post('/vtuaddapproval',upload.single('circularfile'),(req,res) => {
    const a = req.body.circularname;
    const b = req.body.circulardate;
    const c = req.file.path;
    
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.vtuapproval (cirname,cirlink,cirdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    console.log(a);
    console.log(b);
    console.log(c);
    res.redirect('/vtuapproval');
})


router.post('/vtucirdelete',(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.vtucircular where cirname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/vtucircular');
})

router.post('/vtuapprovaldelete',(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.vtuapproval where cirname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/vtuapproval');
})


module.exports = router;