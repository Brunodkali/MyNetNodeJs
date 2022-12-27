const { listarArquivosDoDiretorio } = require('../utils/app.js');
const { login, registrar, trocarSenha, logOut, selecionarImagem, criarGrupo } = require("../controllers/userController.js");
const Usuarios = require("../models/userModel");
const router = require("express").Router();

router.post("/loginDB", login);
router.post("/cadastroDB", registrar);
router.post("/trocarSenha", trocarSenha);
router.post("/selecionarAvatar", selecionarImagem);
router.post("/criarGrupos", criarGrupo);

router.get("/logOut", logOut);

router.get("/criarGrupo", async (req, res) => {
    let listaUsuarios = await Usuarios.find();
    res.render('criarGrupo', { status: 200, listaUsuarios: listaUsuarios });
});

router.get("/selecioneAvatar", async (req, res) => {
    let imgsAvatar = await listarArquivosDoDiretorio('./public/imgUsers');
    res.render('selecaoImg', { status: 200, listaImg: imgsAvatar });
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { status: 200 });
});

router.get('/trocarSenha', async(req, res) => {
    res.render('trocarSenha', { status: 200 });
});
  
module.exports = router;