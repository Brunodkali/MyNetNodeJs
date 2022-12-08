const express = require('express');
const cookies = require("cookie-parser");
const bodyParser = require("body-parser");
const routerGoogle = express.Router();

routerGoogle.use(cookies());
routerGoogle.use(bodyParser.urlencoded({ extended: true }));
routerGoogle.use(bodyParser.json());

routerGoogle.post('/loginGoogle', (req, res) => {
    const token = req.body.credential;
    const client_id = process.env.GOOGLE_CLIENT_ID || '245073186631-0aq6pl4ailrqeruehjuvhkk35iuem2e6.apps.googleusercontent.com';
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(client_id);

    if (!token) {
        return res.status(401).json({Error: 'Token não identificado!'});
    }

    (async () => {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token, 
                audience: client_id, 
            });
            const payload = ticket.getPayload();
            const nomeUser = payload["name"];

            return res.status(200).render('menu', {usuario: nomeUser});
        }catch(err) {
            return err;
        }
    })();
});

module.exports = routerGoogle;