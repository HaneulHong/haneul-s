// mySQL + node.js 접속 코드
var mysql = require("mysql2");
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "myboard",
});

conn.connect();

/*conn.query("select * from post", function (err, rows, fields){
    if (err) throw err;
    console.log(rows);
});*/

const express = require('express');
const app = express();

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.listen(8080, function(){
    console.log("포트 8080으로 서버 대기중 ...")
});

// 홈
app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
})

// /list 요청에 대한 처리 루틴
app.get('/list', function(req, res){
    conn.query("select * from post", function(err, rows, fields){
        if(err) throw err;
        console.log(rows);
        res.render('list.ejs', {data : rows});
    })
});

// /enter 요청에 대한 처리 루틴
app.get('/enter', function(req, res){
    res.sendFile(__dirname + '/enter.html');
    });
    
// /save 요청에 대한 처리 루틴
app.post('/save', function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    //mysql db에 저장하기
    let sql = "insert into post (title, content, created) values(?, ?, now())";
    let params = [req.body.title, req.body.content];
    conn.query(sql, params, function(err, result){
        if (err) throw err;
        console.log('데이터 추가 성공');
    });
    res.send('데이터 추가 성공');
});