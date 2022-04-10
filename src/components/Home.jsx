import React from "react";
import Cabecera from './Navbar'
import Tarjeta from './Card'
import Pie from "./Footer";

function Home() {
    return (
        <div>
            <Cabecera />
            <div className="d-flex justify-content-center">
            <Tarjeta title="Pacientes" 
            description="Administra los pacientes de la clinica mediante simples operaciones." 
            link="/pacientes" portal="Portal Pacientes" img="https://previews.123rf.com/images/wavebreakmediamicro/wavebreakmediamicro1507/wavebreakmediamicro150721214/42408195-joven-hombre-feliz-sonriendo-a-la-c%C3%A1mara-en-los-campos-de-uva.jpg"/>
            <Tarjeta title="Odontologos" 
            description="Ingresa para obtener información y operar sobre los profesionales de la clinica." 
            link="/odontologos" portal="Portal Odontologos" img="https://thumbs.dreamstime.com/b/retrato-del-dentista-sonriente-standing-arms-cruzado-en-la-cl%C3%ADnica-119971211.jpg"/>
            <Tarjeta title="Turnos" 
            description="Aquí puedes consultar información acerca de los turnos y administrar los mismos." 
            link="/turnos" portal="Portal Turnos" img="https://thumbs.dreamstime.com/b/business-meeting-schedule-planning-concept-calendar-pins-laptop-event-flat-lay-copy-space-213172756.jpg"/> 
            </div>
            <Pie />   
        </div>
    );
}

export default Home;