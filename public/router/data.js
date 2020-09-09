const express = require('express');
const session = require('express-session');
const router = express.Router();
const querystring = require('query-string');
const db = require('../lib/db.js');
const {
    v4: uuidv4
} = require('uuid');

let idValue = '';

db.connect();

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({
    extended: false
}));

router.use(session({
    secret: 'a98yhfi&o2u3bn0(rfuw-gvjoiah3@0945u23r#',
    resave: false,
    saveUninitialized: true
}));


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sign_up', (req, res) => {
    res.render('sign-up');
});

router.get('/main', (req, res) => {
    const currentUser = req.session.userId;
    if (currentUser !== undefined) {
        res.render('main');
    } else {
        res.send('do not permitted');
    }
});

router.get('/logout', (req, res) => {
    delete req.session.userId;
    res.redirect('/');
});

router.get('/room/:id', (req, res) => {
    console.log(idValue);
    res.render('success-sign-up');
});

router.post('/room', (req, res) => {
    idValue = uuidv4();
    res.redirect(`/room/:id=${idValue}`);
});



router.post('/main', (req, res) => {
    const userId = req.body.userId;
    const userPw = req.body.userPw;
    db.query(`select * from member where id = "${userId}" and password = "${userPw}"`, (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows[0] !== undefined) {
            req.session.userId = userId;
            res.render('main');
        } else {
            res.send('no data');
        }
    })
});

router.post('/success_sign_up', (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    const passwordRe = req.body.passwordRe;
    const name = req.body.name;
    const email = req.body.email;
    const date = req.body.date;
    const phone = req.body.phone;
    if (password !== passwordRe) {
        res.send('please check your password ');
    } else {
        db.query(`insert into member values(?,?,?,?,?,?)`, [id, password, name, email, date, phone], (err, rows) => {
            if (err) throw err;
        })
        res.render('success-sign-up');
    }
});

module.exports = router;