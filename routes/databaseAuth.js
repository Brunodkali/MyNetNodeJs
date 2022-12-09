const express = require('express');
const bodyParser = require("body-parser");
const routerDbAuth = express.Router();
const database = require('../models/database.js');
const md5 = require('md5');

routerDbAuth.use(bodyParser.urlencoded({ extended: true }));
routerDbAuth.use(bodyParser.json());

routerDbAuth.get('/cadastro', (req, res) => {
    res.render('cadastro', { status: 200 });
});

routerDbAuth.post('/loginDB', async (req, res)=> {
    try{
        let login = req.body.login;
        let senha = req.body.senha;
        let senhaHash = md5(senha);
        let users = await database.collection('usuarios').find().toArray();

        try {
            for(let i = 0; i < users.length; i++) {
                let emailUsuario = users[i].email;
                let senhaUsuario = users[i].senha;
                let nomeUsuario = users[i].name;
                let senhaExibir = md5(senhaUsuario);
                
                if(login == emailUsuario && senhaHash == senhaUsuario){
                    return res.status(200).render('menu', { usuario: nomeUsuario[0].toUpperCase() + nomeUsuario.substr(1), email: emailUsuario, senha: senhaExibir   });
                }
            }
            if (login != null || senha != null) {
                return res.status(401).redirect('/');
            }
         }catch(err) {
            return err;
        }
    }catch(err) {
        return res.send('Ocorreu um erro na autenticação');
    }
});

routerDbAuth.post('/cadastroDB', async(req, res) => {
    let login = req.body.login;
    let nome = req.body.nome;
    let senha = req.body.senha;
    let confSenha = req.body.confSenha;

    try {
        if (senha == confSenha) {
            let hashSenha = md5(senha);
            let doc = { name: nome, email: login, senha: hashSenha }
            let insert = await database.collection('usuarios').insertOne(doc);

            return res.status(200).render('index');
        }else {
            return res.status(401).render('cadastro', { status: 401 });
        }
    }catch(err) {
        return err;
    }
});

routerDbAuth.post('/trocarSenha', async(req, res) => {
    res.render('trocarSenha');

    let senhaTroca = req.body.senhaTroca;
    let confSenhaTroca = req.body.confSenhaTroca;

    try {
        if (senhaTroca == confSenhaTroca) {
            let hashSenha = md5(senha);
            let doc = { name: nome, email: login, senha: hashSenha }
            let insert = await database.collection('usuarios').insertOne(doc);

            return res.status(200).render('index');
        }else {
            return res.status(401).render('cadastro', { status: 401 });
        }
    }catch(err) {
        return err;
    }
});

module.exports = routerDbAuth;