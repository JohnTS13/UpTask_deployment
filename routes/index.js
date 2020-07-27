const express = require('express');
const router = express.Router();

//Importar express validator para VALIDACIONES
const {body} = require('express-validator/check');

//Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
    // ruta para home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectoHome
    );
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), //hace las validaciones a "nombre", se piueden ver mas en la documentacion de express validator
        proyectosController.nuevoProyecto
    );

    //Listar proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    
    //Actualizar el Proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), //hace las validaciones a "nombre", se piueden ver mas en la documentacion de express validator
        proyectosController.actualizarProyecto
    );

    //Eliminar proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //Tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
    
    //Actualizar tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    ); //es como un update el .patch

    //Eliminar una tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );
    
    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formularioCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formularioIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    
    //cerrar sesion
    router.get('/cerrar-sesion', 
        authController.usuarioAutenticado,
        authController.cerrarSesion
    );

    //restablecer contraseña 
    router.get('/reestablecer', usuariosController.formularioRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword);
    return router;
};