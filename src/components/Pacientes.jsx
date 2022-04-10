import React from 'react';
import Cabecera from './Navbar'
import TarjetaCrud from "./CrudCard";
import Swal from 'sweetalert2'

export default function PortalPacientes() {
    return (
        <div>
            <Cabecera />
            <TarjetaCrud titleCrear="Crea un nuevo paciente" titleListar="Buscar todos los pacientes"
            titleBuscar="Busca un paciente por ID"
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
    <th>DNI</th>
    <th>Fecha de Ingreso</th>
    <th>Direccion</th>
    </tr>
    </thead>
    <tbody id="cuerpo">
    </tbody>
    </table>`;

    fetch('https://clinica-odontologica-back.herokuapp.com/patients/all').then(function (response) {
        if (response.ok) {
            response.json()
                .then((data) => {
                    data.map((pac) => {
                        return document.querySelector('#cuerpo').innerHTML +=
                            `<tr>
                              <td data-column="#">${pac.id}</td>
                              <td data-column="Nombre y Apellido">${pac.name} ${pac.lastName}</td>
                              <td data-column="DNI">${pac.dni}</td>
                              <td data-column="Fecha de Ingreso"> ${pac.entryDate}</td>
                              <td data-column="Direccion"> ${pac.address.street} ${pac.address.number}, ${pac.address.location}, ${pac.address.province}</td>
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
    fetch(`https://clinica-odontologica-back.herokuapp.com/patients/${id.value}`).then(function (response) {
        if (response.ok) {
            response.json()
                .then((data) => {
                    divResultado.innerHTML =
                        `<table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre y Apellido</th>
                                    <th>DNI</th>
                                    <th>Fecha de Ingreso</th>
                                    <th>Dirección</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <td data-column="#">${data.id}</td>
                                    <td data-column="Nombre y Apellido">${data.name} ${data.lastName}</td>
                                    <td data-column="DNI">${data.dni}</td>
                                    <td data-column="Fecha de Ingreso">${data.entryDate}</td>
                                    <td data-column="Direccion">${data.address.street} ${data.address.number}, ${data.address.location}, ${data.address.province}</td>
                            </tbody>
                        </table>
                        <div>
                        <button type="submit" id="idModificar" class="btn btn-success">Modificar</button>
                        <button type="submit" id="idEliminar" class="btn btn-danger">Eliminar</button>
                        </div>`

                    let botonModificar = document.querySelector("#idModificar");

                    botonModificar.addEventListener('click', (e) => {

                        divResultado.innerHTML = `<form id="modifPaciente">
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
                                <label>DNI</label>
                                <input type="text" id="dni" class="form-control" />
                            </div>
                        </div>
                        <br />
                        <label>Domicilio:</label>
                        <br />
                        <br />
                        <div class="form-group row">
                            <div class="col-lg-2">
                                <label>Calle</label>
                                <input type="text" id="calle" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>Número</label>
                                <input type="text" id="numero" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>Localidad</label>
                                <input type="text" id="localidad" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>Provincia</label>
                                <input type="text" id="provincia" class="form-control" />
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </form>`

                        document.querySelector("#nombre").value = data.name;
                        document.querySelector("#apellido").value = data.lastName;
                        document.querySelector("#dni").value = data.dni;
                        document.querySelector("#calle").value = data.address.street;
                        document.querySelector("#numero").value = data.address.number;
                        document.querySelector("#localidad").value = data.address.location;
                        document.querySelector("#provincia").value = data.address.province;

                        let formModificar = document.querySelector("#modifPaciente");
                        formModificar.addEventListener('submit', (e) => {
                            e.preventDefault();

                            let datosPaciente = {
                                id: data.id,
                                name: document.querySelector("#nombre").value,
                                lastName: document.querySelector("#apellido").value,
                                dni: document.querySelector("#dni").value,
                                entryDate: data.entryDate,
                                address: {
                                    id: data.address.id,
                                    street: document.querySelector("#calle").value,
                                    number: document.querySelector("#numero").value,
                                    location: document.querySelector("#localidad").value,
                                    province: document.querySelector("#provincia").value
                                }
                            }

                            let config = {
                                method: "PUT",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(datosPaciente)
                            }

                            fetch('https://clinica-odontologica-back.herokuapp.com/patients/update', config)
                                .then((respuesta) => respuesta.json())
                                .then((data) => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito!',
                                        text: 'Paciente modificado correctamente',
                                    })

                                    formModificar.reset();
                                })
                                .catch((error) => console.log(error))

                        })
                    })


                    //borrar el paciente buscado
                    let botonBorrar = document.querySelector("#idEliminar");
                    botonBorrar.addEventListener('click', (e) => {

                        let config = {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: ""
                        }

                        fetch(`https://clinica-odontologica-back.herokuapp.com/patients/delete/${data.id}`, config)
                            .then((respuesta) => {
                                if (respuesta.status === 204) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito!',
                                        text: 'Paciente eliminado',
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
                text: 'Paciente no encontrado',
            })
        }
    })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch: ' + error.message)
        });
}

function crear() {
    const divResultado = document.querySelector("#resultado");
    divResultado.innerHTML = `<form id="datosPaciente">
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
            <label>DNI</label>
            <input type="text" id="dni" class="form-control" />
        </div>
    </div>
    <br />
    <label>Domicilio:</label>
    <br />
    <br />
    <div class="form-group row">
        <div class="col-lg-2">
            <label>Calle</label>
            <input type="text" id="calle" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>Número</label>
            <input type="text" id="numero" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>Localidad</label>
            <input type="text" id="localidad" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>Provincia</label>
            <input type="text" id="provincia" class="form-control" />
        </div>
    </div>
    <button class="btn btn-primary" type="submit">Guardar</button>
</form>`;

    let nombrePac = document.querySelector("#nombre"),
        apellidoPac = document.querySelector("#apellido"),
        dni = document.querySelector("#dni"),
        calle = document.querySelector("#calle"),
        numero = document.querySelector("#numero"),
        localidad = document.querySelector("#localidad"),
        provincia = document.querySelector("#provincia"),
        formulario = document.querySelector("#datosPaciente");

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        let datosPaciente = {
            name: nombrePac.value,
            lastName: apellidoPac.value,
            dni: dni.value,
            entryDate: "",
            address: {
                street: calle.value,
                number: numero.value,
                location: localidad.value,
                province: provincia.value
            }
        }

        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPaciente)
        }

        fetch('https://clinica-odontologica-back.herokuapp.com/patients/save', config)
            .then((respuesta) => respuesta.json())
            .then((data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito!',
                    text: 'Paciente agregado',
                })
                formulario.reset();
            })
            .catch((error) => console.log(error))
    })
}







