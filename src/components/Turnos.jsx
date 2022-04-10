import React from 'react';
import Cabecera from './Navbar'
import TarjetaCrud from "./CrudCard";
import Swal from 'sweetalert2'

export default function PortalTurnos() {
    return (
        <div>
            <Cabecera />
            <TarjetaCrud titleCrear="Crea un nuevo turno" titleListar="Buscar todos los turnos"
            titleBuscar="Busca un turno por ID"
            listar={listarTodos} buscar={buscarPorId} crear={crear} />
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
    <th>Fecha y Hora</th>
    <th>Paciente</th>
    <th>Odontologo</th>
    </tr>
    </thead>
    <tbody id="cuerpo">
    </tbody>
    </table>`;

    fetch('https://clinica-odontologica-back.herokuapp.com/appointments/all').then(function (response) {
        if (response.ok) {
            response.json()
                .then((data) => {
                    data.map((turno) => {
                        return document.querySelector('#cuerpo').innerHTML +=
                            `<tr>
                              <td data-column="#">${turno.id}</td>
                              <td data-column="Fecha y Hora">${turno.dateTime + " Hs"}</td>
                              <td data-column="Paciente">${turno.patient.name} ${turno.patient.lastName}</td>
                              <td data-column="Odontologo">${turno.dentist.name} ${turno.dentist.lastName}</td>
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
    fetch(`https://clinica-odontologica-back.herokuapp.com/appointments/${id.value}`).then(function (response) {
        if (response.ok) {
            response.json()
                .then((data) => {
                    divResultado.innerHTML =
                        `<table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha y Hora</th>
                                    <th>Paciente</th>
                                    <th>Odontologo</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <td data-column="#">${data.id}</td>
                                    <td data-column="Fecha y Hora">${data.dateTime + " Hs"}</td>
                                    <td data-column="Paciente">${data.patient.name} ${data.patient.lastName}</td>
                                    <td data-column="Odontologo">${data.dentist.name} ${data.dentist.lastName}</td>
                            </tbody>
                        </table>
                        <div>
                        <button type="submit" id="idModificar" class="btn btn-success">Modificar</button>
                        <button type="submit" id="idEliminar" class="btn btn-danger">Eliminar</button>
                        </div>`

                    let botonModificar = document.querySelector("#idModificar");

                    botonModificar.addEventListener('click', (e) => {

                        divResultado.innerHTML = `<form id="modifTurno">
                        <div class="form-group row">
                            <div class="col-lg-2">
                                <label>Fecha</label>
                                <input type="text" id="fecha" placeholder="AAAA-MM-DD" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>Hora</label>
                                <input type="text" id="hora" placeholder="HH:mm" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>ID Paciente</label>
                                <input type="text" id="idPaciente" class="form-control" />
                            </div>
                            <div class="col-lg-2">
                                <label>ID Odontologo</label>
                                <input type="text" id="idOdontologo" class="form-control" />
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </form>`

                        document.querySelector("#fecha").value = data.dateTime.slice(0, 10).split('-').reverse().join('-');
                        document.querySelector("#hora").value = data.dateTime.slice(11, 16);
                        document.querySelector("#idPaciente").value = data.patient.id;
                        document.querySelector("#idOdontologo").value = data.dentist.id;

                        let formModificar = document.querySelector("#modifTurno");
                        formModificar.addEventListener('submit', (e) => {
                            e.preventDefault();

                            let fechaHora = document.querySelector("#fecha").value.split('-').reverse().join('-') + " " + document.querySelector("#hora").value;

                            let datosTurno = {
                                id: data.id,
                                dateTime: fechaHora,
                                patient: {
                                    id: document.querySelector("#idPaciente").value
                                },
                                dentist: {
                                    id: document.querySelector("#idOdontologo").value
                                }
                            }

                            let config = {
                                method: "PUT",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(datosTurno)
                            }

                            fetch('https://clinica-odontologica-back.herokuapp.com/appointments/update', config).then(function (response) {
                                if (response.ok) {
                                    response.json()
                                        .then((data) => {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Éxito!',
                                                text: 'Turno modificado correctamente',
                                            })

                                            formModificar.reset();
                                        }
                                        )
                                } else {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Error',
                                        text: 'Hubo un error en los datos ingresados',
                                    })
                                }
                            })
                                .catch(function (error) {
                                    console.log('Hubo un problema con la petición Fetch: ' + error.message)
                                });
                        })
                    })


                    //borrar el turno buscado
                    let botonBorrar = document.querySelector("#idEliminar");
                    botonBorrar.addEventListener('click', (e) => {

                        let config = {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: ""
                        }

                        fetch(`https://clinica-odontologica-back.herokuapp.com/appointments/delete/${data.id}`, config)
                            .then((respuesta) => {
                                if (respuesta.status === 204) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito!',
                                        text: 'Turno eliminado',
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
                text: 'Turno no encontrado',
            })
        }
    })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch: ' + error.message)
        });
}

function crear() {
    const divResultado = document.querySelector("#resultado");
    divResultado.innerHTML = `<form id="datosTurno">
    <div class="form-group row">
        <div class="col-lg-2">
            <label>Fecha</label>
            <input type="text" id="fecha" placeholder="AAAA-MM-DD" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>Hora</label>
            <input type="text" id="hora" placeholder="HH:mm" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>ID Paciente</label>
            <input type="text" id="idPaciente" class="form-control" />
        </div>
        <div class="col-lg-2">
            <label>ID Odontologo</label>
            <input type="text" id="idOdontologo" class="form-control" />
        </div>
    </div>
    <button type="submit" class="btn btn-primary">Guardar</button>
</form>`

    let fechaTurno = document.querySelector("#fecha"),
        horaTurno = document.querySelector("#hora"),
        idPaciente = document.querySelector("#idPaciente"),
        idOdontologo = document.querySelector("#idOdontologo"),
        formulario = document.querySelector("#datosTurno");

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        let datosTurno = {
            dateTime : fechaTurno.value + " " + horaTurno.value,
            dentist : {
                id: idOdontologo.value
            },
            patient : {
                id: idPaciente.value
            }
        }

        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosTurno)
        }

        fetch('https://clinica-odontologica-back.herokuapp.com/appointments/save', config).then(function (response) {
            if (response.status === 201) {
                response.json()
                    .then((data) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito!',
                            text: 'Turno creado',
                        })

                        formulario.reset();
                    }
                    )
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Hubo un error en los datos ingresados',
                })
            }
        })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch: ' + error.message)
            });
    })
          
}