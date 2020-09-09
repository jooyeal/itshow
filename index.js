const express = require('express');
const app = express();
const data = require('./public/router/data.js');

app.use(data);
app.set('view engine', 'pug');
app.set('views', './views');


app.listen(3000, () => {
    console.log('Express App on port 3000!');
});