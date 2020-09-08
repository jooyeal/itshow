const express = require('express');
const app = express();
const db = require('./lib/db.js');
const bodyParser = require('body-parser');

db.connect();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'pug');
app.set('views', './views');



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/sign_up', (req, res) => {
    res.render('sign-up');
});
app.get('/main', (req, res) => {
    res.render('main');
});

app.post('/main', (req, res) => {
    const userId = req.body.userId;
    const userPw = req.body.userPw;
    db.query(`select * from member where id = ${userId} and password = ${userPw}`, (err, rows) => {
        if (err) throw err;
        if (rows[0] !== undefined) {
            res.render('main');
        } else {
            res.send('no data');
        }
    })
});


app.post('/success_sign_up', (req, res) => {
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

app.listen(3000, () => {
    console.log('Express App on port 3000!');
});