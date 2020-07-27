import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        //Forma de acceder al atributo personalizado de tareas.pug "data-proyecto-url=proyecto.url" es e."target,dataset.proyectoURL" SE QUITA EL - Y LA SIGUIENTE LETRA EN EN MAYUSCULAS
        const urlProyecto = e.target.dataset.proyectoUrl;
        //console.log(urlProyecto);
        Swal.fire({
            title: '¿Estas seguro de borrar este proyecto?',
            text: "Esta acción no se podra deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                
                //enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                //console.log(url);

                axios.delete(url, {params: {urlProyecto}})
                    .then(function(respuesta){
                        //console.log(respuesta);

                        Swal.fire(
                            respuesta.data,
                            'Tu proyecto se elimino correctamente',
                            'success'
                        )
                        // redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 300);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        });
                    });

                    

                
            }
        })
    });
}
export default btnEliminar; // por si no existe el boton