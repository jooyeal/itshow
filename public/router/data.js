const express = require('express');
const session = require('express-session');
const router = express.Router();
const querystring = require('query-string');
const db = require('../lib/db.js');
const shortId = require('short-uuid');
const {
    render
} = require('pug');
const {
    isBuffer
} = require('util');
let idString = '';

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
    const idValue = req.params.id;
    idString = idValue.substr(4);

    db.query(`select * from ${idString} where id = '${req.session.userId}'`, (err, rows) => {
        if (err) throw err;

        if (rows[0] !== undefined) {
            res.render('room', {
                message: `${req.session.userId} welcome connected success in ===>${idString}`
            });
        } else {
            res.send('please to re-enter the room');
        }
    })
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

router.post('/room', (req, res) => {
    const translator = shortId('abcdefghijklmnopqrstuvwxyz');
    idString = translator.new();
    const roomCreatePassword = req.body.roomCreatePassword;
    db.query(`insert into rooms values(?,?)`, [idString, roomCreatePassword], (err, rows) => {
        if (err) throw err;
    });
    db.query(`create table ${idString} (id varchar(20) not null, primary key(id))`, (err, rows) => {
        if (err) throw err;
    });
    db.query(`insert into ${idString} values(?)`, [req.session.userId], (err, rows) => {
        if (err) throw err;
    });

    db.query(`select * from user_${req.session.userId} where enteredRoomId = '${idString}'`, (err, rows) => {
        if (err) throw err;
        if ([rows[0] === undefined]) {
            db.query(`insert into user_${req.session.userId} values(?)`, [idString], (err, rows) => {
                if (err) {
                    throw err;
                };
            })
        } else {
            res.send('already exist');
        }
    });


    res.redirect(`/room/:id=${idString}`);
});

router.post('/enter', (req, res) => {
    const roomId = req.body.roomId;
    const roomEnterPassword = req.body.roomEnterPassword;


    db.query(`select * from rooms where roomid = ? and roompassword = ?`, [roomId, roomEnterPassword], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows[0] !== undefined) {
            db.query(`select * from ${roomId} where id = '${req.session.userId}'`, (err, rows1) => {
                if (err) throw err;
                if (rows1[0] === undefined) {
                    db.query(`insert into ${roomId} values(?)`, [req.session.userId], (err, rows) => {
                        if (err) throw err;
                    });
                    db.query(`insert into user_${req.session.userId} values(?)`, [roomId], (err, rows) => {
                        if (err) throw err;
                    });
                }
                res.redirect(`/room/:id=${roomId}`);
            });

        } else {
            res.send(`don't exist room`);
        }
    });
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
    db.query(`select * from member where id = ?`, [id], (err, rows) => {
        if (err) throw err;
        if (rows[0] === undefined) {
            if (password !== passwordRe) {
                res.send('please check your password ');
            } else {
                db.query(`insert into member values(?,?,?,?,?,?)`, [id, password, name, email, date, phone], (err, rows) => {
                    if (err) throw err;
                })
                res.send('success sign up');
            }
        } else {
            res.send('id already exist');
        }
    });



    db.query(`create table user_${id} (enteredRoomId varchar(100) not null)`, (err, rows) => {
        if (err) throw err;
    });
});

module.exports = router;