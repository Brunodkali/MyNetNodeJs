const Usuarios = require("../models/userModel");
const Grupos = require("../models/groupsModel.js");
const md5 = require('md5');

module.exports.login = async (req, res) => {
    try{
        let usuario = await Usuarios.find({ email: req.body.login });
        let listaUsuarios = await Usuarios.find();
        let listaGrupos = await Grupos.find();
        let senhaHash = md5(req.body.senha);

        try {
            if(req.body.login == usuario[0].email && senhaHash == usuario[0].senha){
                let jsonDados = { 
                    usuario: usuario[0].name, 
                    email: usuario[0].email,
                    avatarImg: usuario[0].avatar,
                    auth: 'databaseAuth', 
                    listaUsuarios: listaUsuarios,
                    listaGrupos: listaGrupos
                }

                req.session.user = jsonDados;
                res.render('menu', jsonDados);
            }
            
            if (login != null || senha != null) {
                return res.status(401).redirect('/');
            }
         }catch(err) {
            return err;
        }
    }catch(err) {
        return res.send(`Ocorreu um erro na autenticação, ${err}`);
    }
};

module.exports.registrar = async (req, res) => {
    try {
        if (req.body.senha == req.body.confSenha) {
            let hashSenha = md5(req.body.senha);

            await Usuarios.create({
                name: req.body.nome,
                email: req.body.login,
                senha: hashSenha,
                avatar: './public/imgUsers/avatar0.png',
            });
            return res.status(200).render('index');
        }else {
            return res.status(401).render('cadastro', { status: 401 });
        }
    }catch(err) {
        return err;
    }
};

module.exports.trocarSenha = async (req, res) => {
    try {
        if (req.body.senhaTroca == req.body.confSenhaTroca) {
            let filter = { email: req.body.emailTroca };
            let options = { upsert: false };
            let hashSenhaNova = md5(req.body.senhaTroca);
            let senhaNova = { 
                $set: {
                    senha: hashSenhaNova 
                }
            }

            await Usuarios.updateOne(filter, senhaNova, options);
            return res.status(200).render('index');
        }else {
            return res.status(401).render('trocarSenha', { status: 401 });
        }
    }catch(err) {
        return err
    }
};

module.exports.selecionarImagem = async (req, res) => {
    try {
        let jsonDados = req.session.user;
        let filter = { email: req.body.emailTroca };
        let options = { upsert: false };
        let avatarImg = { 
           $set: {
                avatar: req.body.valueAvatar
            }
        }

        await Usuarios.updateOne(filter, avatarImg, options);
        return res.status(200).render('menu', jsonDados);
    }catch(err) {
        return err;
    }
};

module.exports.logOut = (req, res) => {
    try {
        return res.status(200).render('index');
    }catch(err) {
        return err;
    }
}; 

module.exports.criarGrupo = async (req, res) => {
    try {
        let jsonDados = req.session.user;
        let nomeGrupo = req.body.nomeGrupo;
        let usersGrupo = req.body.nameUsersGroup;
        console.log(usersGrupo)
        let participantes = [];
    
        try {
            let groupAdd = await Grupos.create({
                name: nomeGrupo,
                message: '',
                users: usersGrupo
            });
            
            return res.status(200).render('menu', jsonDados);
        }catch(err) {
            return err;
        }
    }catch(err) {
        return err;   
    }
};

module.exports.msgGrupo = async (req, res) => {
    try {
        let avatar = req.body.valueAvatar;
        let emailTroca = req.body.nameUsersGroup;
        let filter = { email: emailTroca };
        let options = { upsert: false };
        let avatarImg = { 
           $set: {
                avatar: avatar
            }
        }
        let update = await Usuarios.updateOne(filter, avatarImg, options);

        return res.status(200).render('index');
    }catch(err) {
        return err;
    }
};