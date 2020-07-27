const Sequelize = require('sequelize');

//EXTRAER VALORES DE VARIABLES.ENV
require('dotenv').config({path: 'variables.env'});

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
    process.env.DB_NOMBRE,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        operatorsAliases: 0,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
    }
});

module.exports = db;