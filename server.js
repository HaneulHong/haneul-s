// 몽고DB접속 코드
const mongoclient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:1234@cluster0.umjapg3.mongodb.net/';
let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
        //mydb.collection('post').find().toArray(function(err, result){
        //    console.log(result);
        //})

        app.listen(8080, function(){
            console.log('포트8080으로 서버 대기중 ...');
        });
    }).catch(err=> {
        console.log(err);
    });
/*
// muSQL + node.js 접속 코드
var mysql = require("mysql2");
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "myboard",
});

conn.connect();

conn.query("select * from post", function (err, rows, fields){
    if (err) throw err;
    console.log(rows);
});
*/
const express = require('express');
const app = express();

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended:true}));

/*
app.listen(8080, function(){
    console.log("포트 8080으로 서버 대기중 ...")
});

app.get('/book', function(req, res){
    res.send('도서 목록 관련 페이지 입니다.');
})

/* app.get('/', function(req, res){
    res.send(
        '<html>\
        <body>\
        <h1>홈 입니다.</h1>\
        <marquee>이창현님, 반갑습니다.</marquee>\
        </body>\
        </html>'
        );
}) */

app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
})

app.get('/list', function(req, res){
    //conn.query("select * from post", function(err, rows, fields){
    //    if(err) throw err;
    //    console.log(rows);
    mydb.collection('post').find().toArray().then(result => {
        console.log(result);
    })
});

// /enter 요청에 대한 처리 루틴
app.get('/enter', function(req, res){
    res.sendFile(__dirname + '/enter.html');
    });
    
// /save 요청에 대한 처리 루틴
app.post('/save', function(req,res){
    console.log(req);
    console.log('저장완료');
});