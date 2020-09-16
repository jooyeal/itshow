const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../lib/db.js');

const {
    render
} = require('pug');
const {
    isBuffer
} = require('util');
let idString = '';


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
    const idValue = req.params.id;
    idString = idValue.substr(4);

    db.query(`select * from ${idString} where id = '${req.session.userId}'`, (err, rows) => {
        if (err) throw err;

        if (rows[0] !== undefined) {
            res.render('room', {
                message: `${req.session.userId} welcome connected success in ===>${req.params.id}`,
                room: req.params.id,
                user: req.session.userId
            });
        } else {
            res.send('please to re-enter the room');
        }
    });


});

router.get('/room_exit', (req, res) => {
    db.query(`delete from ${idString} where id = '${req.session.userId}'`, (err, rows) => {
        if (err) throw err;
    })
    db.query(`delete from user_${req.session.userId} where enteredRoomId = '${idString}'`, (err, rows) => {
        if (err) throw err;
    })
    res.send('success exit');
});

router.get('/profile', (req, res) => {
    db.query(`select * from user_${req.session.userId}`, (err, rows) => {
        res.render('profile', {
            rows: rows
        });
    });

});


module.exports = router;