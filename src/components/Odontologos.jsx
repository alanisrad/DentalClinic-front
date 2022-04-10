import React from 'react';
import Cabecera from './Navbar'
import TarjetaCrud from "./CrudCard";
import Swal from 'sweetalert2'

export default function PortalOdontologos() {
    return (
        <div>
            <Cabecera />
            <TarjetaCrud titleCrear="Crea un nuevo odontologo" titleListar="Buscar todos los odontologos"
            titleBuscar="Busca un odontologo por ID"
            listar={listarTodos} buscar={buscarPorId} crear={crear}/>
            <div className="mb-5 d-flex justify-content-center" id="resultado">
            </div>
        </div>
    )
}

function listarTodos() {
    const divResultado = document.querySelector("#resultado");
    divResultado.innerHTML =
        `<table>
    <thead>
    <tr>
    <th>#</th>
    <th>Nombre y Apellido</th>
    <th>N° Matricula</th>
    </tr>
    </thead>
    <tbody id="cuerpo">
    </tbody>
    </table>`;

    fetch('https://clinica-odontologica-back.herokuapp.com/dentists/all').then(function (response) {
        if (response.ok) {
            response.json()
                .then((data) => {
                    data.map((odon) => {
                        return document.querySelector('#cuerpo').innerHTML +=
                            `<tr>
                              <td data-column="#">${odon.id}</td>
                              <td data-column="Nombre y Apellido">${odon.name} ${odon.lastName}</td>
                              <td data-column="N° Matricula">${odon.licenseNumber}</td>
                        </tr>`
                    });
                })
        } else {
            console.log('Respuesta de red OK pero respuesta HTTP no Ok');
        }
    })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch: ' + error.message)
        });
}

function buscarPorId(event) {
    const divResultado = document.querySelector("#resultado");
    divResultado.innerHTML = "";
    let id = document.querySelector("#inputID");
    event.preventDefault();
    fetch(`https://clinica-odontologica-back.herokuapp.com/dentists/${id.value}`).then(function (response) {
        if (response.ok) {
            response.json()
                .then((data) => {
                    divResultado.innerHTML =
                        `<table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre y Apellido</th>
                                    <th>N° Matricula</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <td data-column="#">${data.id}</td>
                                    <td data-column="Nombre y Apellido">${data.name} ${data.lastName}</td>
                                    <td data-column="N° Matricula">${data.licenseNumber}</td>
                            </tbody>
                        </table>
                        <div>
                        <button type="submit" id="idModificar" class="btn btn-success">Modificar</button>
                        <button type="submit" id="idEliminar" class="btn btn-danger">Eliminar</button>
                        </div>`

                    let botonModificar = document.querySelector("#idModificar");

                    botonModificar.addEventListener('click', (e) => {

                        divResultado.innerHTML = `<form id="modifOdontologo">
                        <div class="form-group row">
                            <div class="col-lg-2">
                                <label>Nombre</label>
                                <input type="text" id="nombre" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>Apellido</label>
                                <input type="text" id="apellido" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>N° Matricula</label>
                                <input type="text" id="matricula" class="form-control" />
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </form>`

                        document.querySelector("#nombre").value = data.name;
                        document.querySelector("#apellido").value = data.lastName;
                        document.querySelector("#matricula").value = data.licenseNumber;

                        let formModificar = document.querySelector("#modifOdontologo");
                        formModificar.addEventListener('submit', (e) => {
                            e.preventDefault();

                            let datosOdontologo = {
                                id: data.id,
                                name: document.querySelector("#nombre").value,
                                lastName: document.querySelector("#apellido").value,
                                licenseNumber: document.querySelector("#matricula").value
                            }

                            let config = {
                                method: "PUT",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(datosOdontologo)
                            }

                            fetch('https://clinica-odontologica-back.herokuapp.com/dentists/update', config)
                                .then((respuesta) => respuesta.json())
                                .then((data) => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito!',
                                        text: 'Odontologo modificado correctamente',
                                    })

                                    formModificar.reset();
                                })
                                .catch((error) => console.log(error))

                        })
                    })


                    //borrar el odontologo buscado
                    let botonBorrar = document.querySelector("#idEliminar");
                    botonBorrar.addEventListener('click', (e) => {

                        let config = {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: ""
                        }

                        fetch(`https://clinica-odontologica-back.herokuapp.com/dentists/delete/${data.id}`, config)
                            .then((respuesta) => {
                                if (respuesta.status === 204) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito!',
                                        text: 'Odontologo eliminado',
                                    })
                                    divResultado.innerHTML = "";
                                }
                            })
                            .then((data) => console.log(data))
                            .catch((error) => console.log(error))

                    })
                }
                )
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Odontologo no encontrado',
            })
        }
    })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch: ' + error.message)
        });
}

function crear() {
    const divResultado = document.querySelector("#resultado");
    divResultado.innerHTML = `<form id="datosOdontologo">
    <div class="form-group row">
        <div class="col-lg-2">
            <label>Nombre</label>
            <input type="text" id="nombre" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>Apellido</label>
            <input type="text" id="apellido" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>N° Matricula</label>
            <input type="text" id="matricula" class="form-control" />
        </div>
    </div>
    <button type="submit" class="btn btn-primary">Guardar</button>
</form>`;

    let nombreOdon = document.querySelector("#nombre"),
        apellidoOdon = document.querySelector("#apellido"),
        matricula = document.querySelector("#matricula"),
        formulario = document.querySelector("#datosOdontologo");

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        let datosOdontologo = {
            name: nombreOdon.value,
            lastName: apellidoOdon.value,
            licenseNumber: matricula.value
        }

        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosOdontologo)
        }

        fetch('https://clinica-odontologica-back.herokuapp.com/dentists/save', config)
            .then((respuesta) => respuesta.json())
            .then((data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito!',
                    text: 'Odontologo agregado',
                })
                formulario.reset();
            })
            .catch((error) => console.log(error))
    })
}