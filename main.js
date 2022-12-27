const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.port || 3000;
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');
const authRoutes = require("./routes/userRouter.js");
const userRouteGoogle = require('./routes/googleAuth.js');
const session = require('express-session');
require('./utils/socket.js')(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
app.use('/', authRoutes, userRouteGoogle);

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(port, (req, res) => {
    console.log(`Servidor rodando em ${port}`);
});