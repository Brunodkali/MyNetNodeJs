const Usuarios = require("../models/userModel");
const md5 = require('md5');

module.exports.login = async (req, res) => {
    try{
        let login = req.body.login;
        let senha = req.body.senha;
        let senhaHash = md5(senha);
        let listaUsuarios = await Usuarios.find();

        try {
            for(let i = 0; i < listaUsuarios.length; i++) {
                let emailUsuario = listaUsuarios[i].email;
                let senhaUsuario = listaUsuarios[i].senha;
                let nomeUsuario = listaUsuarios[i].name;
                
                if(login == emailUsuario && senhaHash == senhaUsuario){
                    let usuario = nomeUsuario[0].toUpperCase() + nomeUsuario.substr(1);

                    res.render('menu', { 
                        usuario: usuario, 
                        email: emailUsuario, 
                        auth: 'databaseAuth', 
                        listaUsuarios: listaUsuarios,
                    });
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
};

module.exports.registrar = async (req, res) => {
    try {
        let login = req.body.login;
        let nome = req.body.nome;
        let senha = req.body.senha;
        let confSenha = req.body.confSenha;
    
        try {
            if (senha == confSenha) {
                let hashSenha = md5(senha);
                let user = await Usuarios.create({
                    name: nome,
                    email: login,
                    senha: hashSenha
                });
                return res.status(200).render('index');
            }else {
                return res.status(401).render('cadastro', { status: 401 });
            }
        }catch(err) {
            return err;
        }
    }catch(err) {
        return err;   
    }
};

module.exports.trocarSenha = async (req, res) => {
    try {
        let emailTroca = req.body.emailTroca;
        let senhaTroca = req.body.senhaTroca;
        let confSenhaTroca = req.body.confSenhaTroca;
    
        try {
            if (senhaTroca == confSenhaTroca) {
                let filter = { email: emailTroca };
                let options = { upsert: false };
                let hashSenhaNova = md5(senhaTroca);
                let senhaNova = { 
                   $set: {
                        senha: hashSenhaNova 
                    }
                }
                let update = await Usuarios.updateOne(filter, senhaNova, options);
    
                return res.status(200).render('index');
            }else {
                return res.status(401).render('trocarSenha', { status: 401 });
            }
        }catch(err) {
            return err;
        }
    }catch(err) {
        return err
    }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
}; 