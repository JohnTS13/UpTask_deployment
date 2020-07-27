const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, // indica que no puedo ir vacio
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            },
            notEmpty:{
                msg: 'El campo Email no puede ir vacio'
            }
        }, 
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'El campo contraseña no puede ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            //console.log(usuario);
            //hashear un password (encriptar password)
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Metodos personalizados
//prototype hace que todos los que utilicen Usuario puedan llamar a la funcion verificarPassword
Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos); // ayq ue un usuario puede crear multiples proyectos

module.exports = Usuarios;