const { constants } = require('buffer');
const cookieParser = require('cookie-parser');
const fs = require(`fs`);
const mysql = require(`mysql-await`);
const { request } = require('http');
const express = require('express');
const app = express();
const session = require('express-session');
app.use(cookieParser());
app.use(session({secret:'secret',resave: true,
saveUninitialized: true,}));
app.use(function(req, res, next) {
    res.locals.usn = req.session.usn;
    next();
  });
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const router = express.Router();
const bcrypt = require('bcryptjs');
 
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
const { v4: uuidv4 } = require('uuid');
uuidv4();


 const con = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "Sujanya@1978",
     database: "lms"
 });
 const user = {
    name:"jhon",
    age : 18,
    nation : "india"
};
 con.connect((err) => {
     if (!err) {
         console.log("Connected");
     }
     else {
         console.log(err)
     }
 })
 let count = 0;


router.get('/userlogin',function(req, res, next){
    res.render('login');
})

router.post('/loginauth', urlencodedParser,function(req,res,next){
    const {USN,password} = req.body;
    let errors = [];
    if(!USN||!password){
        errors.push({msg:'please fill in all fields'});
    }
    if(errors.length>0){
        res.render('login',{errors});
    }else{
        (async () => {
            let datas = await con.awaitQuery('select* from lms.student where usn = ?',[USN]);
            Object.keys(datas).forEach(function(key) {
                var row = datas[key];
                let valpas = bcrypt.compareSync(password,row.password);
                if(valpas){
                    if (req.session.usn) {
                        res.redirect('/');
                    } else {
                      req.session.usn = row.usn;
                      res.redirect('/Class');
                    }
                    
                }else{
                    res.send('Incorrect password or usn');
                }
                
            });
            
        })();
    }
})

  







  


 module.exports = router;