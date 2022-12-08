const express = require('express');
const bodyParser = require("body-parser");
const routerDbAuth = express.Router();
const database = require('../models/database.js');

routerDbAuth.use(bodyParser.urlencoded({ extended: true }));
routerDbAuth.use(bodyParser.json());

routerDbAuth.post('/loginDB', async (req, res)=> {
    try{
        let login = req.body.login;
        let senha = req.body.senha;
        let users = await database.collection('usuarios').find().toArray();

        try {
            for(let i = 0; i < users.length; i++) {
                let nomeUsuario = users[i].name;
                let senhaUsuario = users[i].senha;
                
                if(login == nomeUsuario && senha == senhaUsuario){
                    return res.status(200).render('menu', {usuario: nomeUsuario});
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

module.exports = routerDbAuth;