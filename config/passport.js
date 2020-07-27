const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia del modelo donde vamos a verificar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propias {usuario y password}
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }, 
                });
                //El usuario existe password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    });
                }
                //El email existe y el password es correcto
                return done(null, usuario);
            } catch (error) {
                //este usuario no existe
                return done(null, false, {
                    message: 'Esta cuenta no existe'
                });
            }
        }
    )
);
//serizalizar el usuario
//ponerlo jusnto como un objeto
passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
});

//deserializar el usuario 
//acceder a sus valores interno
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

//exportar
module.exports = passport;