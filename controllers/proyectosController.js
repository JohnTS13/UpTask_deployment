const Proyectos = require('../models/Proyectos');
//const { request } = require('express');
//const { where } = require('sequelize/types');
const Tareas = require('../models/Tareas');

exports.proyectoHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}}); //es como us SELECT EN SQL
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos
    });
    //res.send('index'); //manda ese valor 
};

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}}); //es como us SELECT EN SQL
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}}); //es como us SELECT EN SQL
    //Enviar a la consola lo que el usuario escribio en el formulario
    //console.log(req.body);

    //Validar que tengamos algo en el input
    const {nombre} = req.body; //crea una variable y la asigna
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al Proyecto'});
    }

    //Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        //NO hay errores 
        //agregar a la base de datos
        /*
        Forma 1
        Proyectos.create({nombre})
            .then(() => console.log("Datos ingresados correctamente"))
            .catch(error => console.log(error))*/
        //Forma 2 son async en el export de arriba y await
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    };
};

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}}); //es como us SELECT EN SQL

    const proyectoPromise = Proyectos.findOne({ //es como un select * from ... where en sql
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] =  await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            ProyectoId: proyecto.id
        }/*,
        include: [
            {model:Proyectos}
        ]*/ //hace como un JOIN en SQL para mostrar tambien el proyecto al que hace referencia esa tarea
    });

    if (!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
};

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}}); //es como us SELECT EN SQL

    const proyectoPromise = Proyectos.findOne({ //es como un select * from ... where en sql
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    //Consultas a base de promises para consultas que no dependen una de la otra
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos, 
        proyecto
    })
};

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}}); //es como us SELECT EN SQL
    //Enviar a la consola lo que el usuario escribio en el formulario
    //console.log(req.body);

    //Validar que tengamos algo en el input
    const {nombre} = req.body; //crea una variable y la asigna
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al Proyecto'});
    }

    //Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else {
        //NO hay errores 
        //agregar a la base de datos
        /*
        Forma 1
        Proyectos.create({nombre})
            .then(() => console.log("Datos ingresados correctamente"))
            .catch(error => console.log(error))*/
        //Forma 2 son async en el export de arriba y await
        
        await Proyectos.update(
            {nombre: nombre}, {
            where: {
                id: req.params.id
            }
        });
        res.redirect('/');
    };
};

exports.eliminarProyecto = async (req, res, next) => {
    //podemos traer la url con query o params
    //console.log(req.params, req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where:{url: urlProyecto}});
    
    if (!resultado) return next();

    res.status(200).send('Proyecto eliminado correcatmente');
}