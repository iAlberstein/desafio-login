const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");

// Iniciar sesión
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    if (!req.user) {
        console.log("Usuario no autenticado");
        return res.status(400).json({ error: 'Correo electrónico o contraseña incorrectos' });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role // Establecer el rol del usuario recuperado de la base de datos
    };

    req.session.login = true;
    console.log("Usuario autenticado correctamente");

    res.status(200).json({ message: 'Inicio de sesión exitoso', session: req.session });
});



// Ruta para manejar un inicio de sesión fallido
router.get("/faillogin", async (req, res) => {
    res.status(400).json({ error: 'Correo electrónico o contraseña incorrectos. Por favor, intenta nuevamente' });
});

// Cerrar sesión
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
});

module.exports = router;