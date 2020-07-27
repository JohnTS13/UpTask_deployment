const passport = require("passport");

//importar medelos
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para revisar si el usuario esta login o no
exports.usuarioAutenticado = (req, res, next) => {
    //si esta sutenticado adelante 
    if(req.isAuthenticated()){
        return next();
    };

    //si no esta autenticaso, regresar a iniciar sesion
    return res.redirect('/iniciar-sesion');
}

//funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

//genera un tpken si el usuario es valido 
exports.enviarToken = async (req, res, next) => {
    //verificar que l usuario exista
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: { email }});

    //si no existe el susuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer tu contraseña',
            mensajes: req.flash()
        });
        next();
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; //expiracion del token a 1 hora de su creacion
    
    //guardarlos en la bd
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    //console.log(resetUrl);
    //console.log(token, expiracion);

    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Reestablecer contraseña',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //terminar accion
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) =>{
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //si no encuentra el usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //formulario para generar password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    });
}

exports.actualizarPassword = async (req, res) => {

    //verificar el token pero tamnbien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //verificamos si el usuario existe 
    if (!usuario) {
        req.flash('error', 'Enlace caducado, favor de volver a enviar el enlace');
        res.redirect('/reestablecer');
    }
    //hashear el nuevo password
    usuario.token = null;
    usuario.expiracion = null;
    //console.log(req.body.password);
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Contraseña reestablecida');
    res.redirect('/iniciar-sesion');
}