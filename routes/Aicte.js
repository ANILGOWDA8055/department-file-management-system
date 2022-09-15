const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mysql = require(`mysql-await`);
require('dotenv').config()
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }))

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

router.post('/aictecircularadd' ,upload.single('cir'),(req,res) =>{
    const a = req.body.cirname;
    const b = req.body.cirdate
    const c = req.file.path;
    console.log(a);
    console.log(b);
    console.log(c);
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.aicteapproval (cirname,cirlink,cirdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
    });
    res.redirect('/aictecircular')

})

router.post('/aicteapprovaladd',upload.single('aictecircularfile'),(req,res) => {
    const a = req.body.aictecircularname;
    const b = req.body.aictecirculardate;
    const c = req.file.path;
    console.log(a);
    console.log(b);
    console.log(c);
    
    
    con.connect(function(err){
        var records = [a,c,b];
        con.query("insert into dept.cir (cirname,cirlink,cirdate) VALUES (?,?,?)",[a,c,b] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    
    
})


router.post('/aictecirdelete',(req,res) => {
    const a = req.body.cname;
    console.log(a);
    con.connect(function(err){
        con.query("delete from dept.cir where cirname = ?",[a] , function (err, result, fields){
            if (err) throw err;
            
        })
        
        
    });
    res.redirect('/aictecircular');
})

router.get('/aictecircular',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.cir;');
      res.render('Aicte_circular',{lgs : results})
    })();
    
})

router.get('/aicteapproval',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.aicteapproval;');
      res.render('approvalletters',{lgs : results})
    })();
    
})

module.exports = router;