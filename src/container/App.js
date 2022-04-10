import React from "react";
import Home from "../components/Home"
import PortalPacientes from "../components/Pacientes";
import PortalOdontologos from "../components/Odontologos";
import PortalTurnos from "../components/Turnos";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />}>
          </Route>
          <Route path="/pacientes" element={<PortalPacientes />}>
          </Route>
          <Route path="/odontologos" element={<PortalOdontologos />}>
          </Route>
          <Route path="/turnos" element={<PortalTurnos />}>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
