const { listarArquivosDoDiretorio } = require('../utils/app.js');
const { login, registrar, trocarSenha, logOut, selecionarImagem } = require("../controllers/userController");
const router = require("express").Router();

  
router.post("/loginDB", login);
router.post("/cadastroDB", registrar);
router.post("/trocarSenha", trocarSenha);
router.post("/selecionarAvatar", selecionarImagem);
router.get("/logOut", logOut);

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