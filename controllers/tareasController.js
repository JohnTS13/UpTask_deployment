const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // obtenemos el proyecto actaul
    const proyecto = await Proyectos.findOne({where: {url:req.params.url}});

    //leer el valor del input
    const {tarea} = req.body

    //estado 0 = incumpleto y id del proyecto
    const estado = 0;
    const ProyectoId = proyecto.id;

    //Insertar en la bd
    const resultado = await Tareas.create({tarea, estado, ProyectoId});

    if (!resultado) {
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res) => {
    //cuando usamos un .patch accedemos a los datos con .params
    const { id } = req.params;
    const tarea = await Tareas.findOne( {where: {id} } ); // como tando el nombre del la columna en la tabala en la bd es el mismo que el de la varaiable a la que se le va a comprara podemos solo poner {id} en vez de {id: id}
    
    //cambiar estado
    let estado = 0;
    if(tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Todo bien...');
};

exports.eliminarTarea = async (req, res) => {
    const {id} = req.params;

    //Eliminar la tarea
    const resultado = await Tareas.destroy({where : {id}});

    if (!resultado) return next();

    res.status(200).send('Tarea eliminada correcatmente');
};