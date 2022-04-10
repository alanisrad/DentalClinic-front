import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

export default function Cabecera() {
    return (
        <Navbar bg="primary" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand>Clinica Odontologica</Navbar.Brand>
                <Nav className="me-auto"></Nav>
            </Container>
        </Navbar>
    );
}