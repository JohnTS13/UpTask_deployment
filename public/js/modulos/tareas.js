import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        //console.log(e.target.classList); // ver la clase a la que le das click
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //console.log(idTarea);
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, { idTarea })
                .then(function (respuesta) {
                    icono.classList.toggle('completo'); // si esta se lo quita si no se lo pone
                    actualizarAvance();
                });
        }

        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Estas seguro de borrar esta Tarea?',
                text: "Esta acción no se podra deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                    //enviar el delete por medio de axios
                    axios.delete(url, { params: { idTarea }})
                        .then(function(respuesta){
                            //console.log(respuesta);

                            //Eliminar el Nodo (HTML)
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            //Alerta
                            Swal.fire(
                                'Accion exitosa',
                                respuesta.data,
                                'success'
                            );
                            actualizarAvance();
                        });
                }
            });
        }
    });
}

export default tareas;