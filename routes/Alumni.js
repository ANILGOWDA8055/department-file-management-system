require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const fastcsv = require("fast-csv");

const fs = require(`fs`);
const mysql = require(`mysql-await`);


const path = require('path');
var parse = require('csv-parse');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })



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








router.get('/alumni',(req,res)=>{
    (async () => {
        let results = await con.awaitQuery('select* from dept.cir;');
      res.render('Alumni_details',{lgs : results})
    })();
    
})

// router.get('/addalumni',(req,res)=>{
//     res.sendFile(__dirname+'/index.js');
// })

router.post('/addalumnitry',upload.single('alumnifile'),(req,res) => {
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
        let query = 'INSERT INTO dept.alumni (slno,firstname,lastname,gender,country) VALUES ?';   
        con.query(query, [csvData], (error, response) => {
            console.log(error || response);
        }); 
    });

});

stream.pipe(csvStream);
res.redirect('/alumni');
})

module.exports = router;