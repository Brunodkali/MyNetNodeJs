const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');
const userRouteGoogle = require('./routes/googleAuth.js');
const userRouteDB = require('./routes/databaseAuth.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/', userRouteGoogle, userRouteDB);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, (req, res) => {
    console.log(`Servidor rodando em ${port}`);
});