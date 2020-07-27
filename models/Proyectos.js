const Sequelize = require('sequelize');
const slug = require('slug');
const db = require('../config/db');
const shortid = require('shortid');

const Proyectos = db.define('Proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(50),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            //console.log('Antes de insertar en la BD');
            const url = slug(proyecto.nombre).toLocaleLowerCase();

            //lo agrega como parte del objeto "proyecto" para que lo inserte
            proyecto.url = `${url}-${shortid.generate()}`;
        }, 
        //Se puede hacer una BEFOREUPDATE para actuzalar la URL, pero en ocaciones no sera necesaria
        //si es que es importante manter la misma URL por caso de cupones o etc
        //que funciones mediante una URL
    }
});

//para lo que tenemos en proyectos puedamos exportarlo en otras partes de nuestro proyecto
module.exports = Proyectos;