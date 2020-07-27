//importar
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importar VALORES DE VARIABLES.ENV
require('dotenv').config({path: 'variables.env'});


//NOTA Middlegare ay next 
/*
Los middleware son los trosos de codigo que se estan ejecutando en app.use etc donde en algunos sasos es importante
ademas de poner como parametros res y req tambien poner next y al final de la ejecicion de las instrucciones de este bloque 
pero antes de cerrarlo colocar next(); para que siga ejecutando los sigueintes middleware 
De lo contrario ya no ejecutaria los siguientes 
*/


//herlpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexión a la bd
const db = require('./config/db');

//Verifica la conexion
/*db.authenticate()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error));*/

//Importa modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// sync crea el modelo con toda la estructura si no existe 
db.sync()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error));

//Crear una app de express
const app = express();

//Donde cargar los archivos estaticos (Publicos)
app.use(express.static('public'));

//Habilidat View engine (Pug)
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos de formulario
app.use(bodyParser.urlencoded({extended: true}));

//Agregar express validator a todas las aplicaciones
//app.use(expressValidator());

//Añadir la carpeta de vistas 
//__dirname nos retorna al directorio principal 
app.set('views', path.join(__dirname, './views'));

//agregar el flash messages para validaciones
app.use(flash());

app.use(cookieParser());

//agregar sessiones nos permiten navegar sobre diferentes paginas sin volver a autentificar
app.use(session({
    secret: 'supersecreto', //ayuda a firmar el cookies
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la aplicacion
app.use((req, res, next) => {
    //console.log(req.user); //res.user contiene la informacion del usuario logiado
    res.locals.vardump = helpers.vardump; //crea un objeto para porder consumir en TODOS los archivos de tu proyecto res.locals.NOMBRE_OBJETO
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; // si hay un usuario crea una copia y la asigna a la req.locals.usuario, si no hay un login le asigna null
    //console.log(res.locals.usuario);
    next(); //se asegura de pasar al siguiente middleware que seria app.use(bodyParser.urlencoded....
});

app.use('/', routes());

//servidor y puerto
const host = process.env.HOST || '0.0.0.0' //PARA QUE CUANDO LO SUBAMOS EROCU SE ENCARGUE SE SOLOCAR UNA URL VALIDA AUTOMATICAMENTE
const port = process.env.POST || '3013' //ASIGNARA EROCU DE FORMA AUTOMATICAMENTE UN PUERTO, DE LO CONTRARIO ASIGNA 3013
//EROCU LO ASIGNA DE FORM AUTOMATICA CON process.env.

//Puerto 
app.listen(port, host, () =>{
    console.log('El servidor esta funcionando');
});

