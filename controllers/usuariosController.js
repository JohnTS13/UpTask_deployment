const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formularioCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    });
};

exports.formularioIniciarSesion = (req, res) => {
    //console.log(res.locals.mensajes);
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesion en UpTask',
        error
    });
};

exports.crearCuenta = async (req, res) => {
    //leer los datos
    const {email, password} = req.body;

    //manejo de erro cuando hay correos duplicados, El UNIQUE se pudo en el modelo de Usuario a la bs
    //crear usuario
    try {
        await Usuarios.create({
            email,
            password
        });

        //crear url de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto del usuario
        const usuario = {email};

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Ya casi esta listo, enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password
        });
    }

};

exports.formularioRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    });
};

//cambia el estado de una cuneta 
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}