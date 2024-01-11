// 몽고DB접속 코드
const mongoclient = require('mongodb').MongoClient;
const objid = require('mongodb').ObjectId;
const url = 'mongodb+srv://admin:1234@cluster0.umjapg3.mongodb.net/';
let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
        //mydb.collection('post').find().toArray(function(err, result){
        //    console.log(result);
        //})

        app.listen(8080, function () {
            console.log('포트8080으로 서버 대기중 ...');
        });
    }).catch(err => {
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
// 변수 선언
const express = require('express');
const app = express();
const sha = require('sha256');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// 계정 검사 인증코드 세션 적용
let session = require('express-session');
app.use(session({
    secret: 'akffkdakffkd77',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 라이브러리 추가
app.use(express.static("public"));

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

app.get('/', function (req, res) {
    res.render('index.ejs', { user:req.session.passport });
})

app.get('/list', function (req, res) {
    //conn.query("select * from post", function(err, rows, fields){
    //    if(err) throw err;
    //    console.log(rows);
    mydb.collection('post').find().toArray().then(result => {
        console.log(result);
        res.render('list.ejs', { data: result });
    })
    //res.sendFile(__dirname+'/list.html');
});

// /enter 요청에 대한 처리 루틴
app.get('/enter', function (req, res) {
    //res.sendFile(__dirname + '/enter.html');
    res.render('enter.ejs');
});

// /save 요청에 대한 처리 루틴
app.post('/save', function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);

    // 몽고db db에 데이터 저장
    mydb.collection('post').insertOne(
        { title: req.body.title, content: req.body.content, date: req.body.someDate }
    ).then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
    });
    res.redirect('/list');
});

// delete 요청에 대한 처리 루틴
app.post("/delete", function (req, res) {
    console.log(req.body._id);
    req.body._id = new objid(req.body._id);

    mydb.collection('post').deleteOne(req.body)
        .then(result => {
            console.log('삭제완료');
            res.status(200).send();
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        })
});

// /content 요청에대한 처리루틴
app.get('/content/:id', function (req, res) {
    console.log(req.params.id);
    req.params.id = new objid(req.params.id);
    mydb
        .collection("post")
        .findOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            res.render('content.ejs', { data: result });
        });
});

// /edit 요청에 대한 처리 루틴(게시글 수정)
app.get('/edit/:id', function (req, res) {
    req.params.id = new objid(req.params.id);
    mydb
        .collection("post")
        .findOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            res.render("edit.ejs", { data: result });
        });
});

// 
app.post('/edit', function (req, res) {
    console.log(req.body);
    req.body.id = new objid(req.body.id);
    mydb
        .collection("post")
        .updateOne({ _id: req.body.id }, { $set: { title: req.body.title, content: req.body.content, date: req.body.someDate } })
        .then((result) => {
            console.log("수정완료");
            res.redirect("/list");
        })
        .catch((err) => {
            console.log(err)
        });
});

// 쿠키 생성
let cookieParser = require('cookie-parser');

app.use(cookieParser('kimchijjigae'));
app.get('/cookie', function (req, res) {
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if (isNaN(milk)) {
        milk = 0;
    }
    res.cookie('milk', milk, { signed: true });
    res.send('product : ' + milk + '원');
});

// 세션 라우터 생성
app.get('/session', function (req, res) {
    if (isNaN(req.session.milk)) {
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send('product : ' + milk + '원');
});

// 로그인 라우터 생성
app.get('/login', function (req, res) {
    console.log(req.session.passport);
    if (req.session.passport) {
        console.log('세션유지');
        res.send('로그인 되었습니다.');
    } else {
        res.render('login.ejs')
    }
});

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    console.log(user.userid);
    done(null, user.userid);
})

passport.deserializeUser(function (puserid, done) {
    console.log('deserializeIser');
    console.log(puserid);

    mydb
        .collection('account')
        .findOne({ userid: puserid })
        .then((result) => {
            console.log(result);
            done(null, result);
        })
});

// 로그인
app.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/fail',
    }),
    function (req, res) {
        console.log(req.session);
        console.log(req.session.passport);
        res.render('index.ejs', { user: req.session.passport });
    }
);

passport.use(
    new localStrategy(
        {
            usernameField: 'userid',
            passwordField: 'userpw',
            session: true,
            passReqToCallback: false,
        },
        // db 맵핑
        function (inputid, inputpw, done) {
            mydb
                .collection('account')
                .findOne({ userid: inputid })
                .then((result) => {
                    if (result.userpw == sha(inputpw)) {
                        console.log('새로운 로그인');
                        done(null, result);
                    } else {
                        done(null, false, { message: '비밀번호 틀렸슈' })
                    }
                })
        }
    )
)

// 로그아웃
app.get('/logout', function (req, res) {
    console.log('로그아웃');
    req.session.destroy();
    res.render('index.ejs', { user: null });
});

// 회원가입
app.get('/signup', function (req, res) {
    res.render('signup.ejs')
})

// 회원가입 정보 몽고db로 전송
app.post('/signup', function (req, res) {
    console.log(req.body.userid);
    console.log(sha(req.body.userpw));
    console.log(req.body.usergroup);
    console.log(req.body.useremail);


    mydb
        .collection('account')
        .insertOne({
            userid: req.body.userid,
            userpw: sha(req.body.userpw),
            usergroup: req.body.usergroup,
            useremail: req.body.useremail,
        })
        .then((result) => {
            console.log('회원가입을 축하해유');
        });
    res.redirect('/');
});