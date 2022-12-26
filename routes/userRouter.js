const { login, registrar, trocarSenha, logOut } = require("../controllers/userController");
const router = require("express").Router();
  
router.post("/loginDB", login);
router.post("/cadastroDB", registrar);
router.post("/trocarSenha", trocarSenha);
router.get("/logOut", logOut);

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { status: 200 });
});

router.get('/trocarSenha', async(req, res) => {
    res.render('trocarSenha', { status: 200 });
});
  
module.exports = router;