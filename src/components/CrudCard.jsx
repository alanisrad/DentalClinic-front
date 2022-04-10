import React from "react";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function TarjetaCrud(props) {
    return (
        <div className="col d-flex justify-content-center">
            <Card className="text-center" style={{ width: '18rem', margin: '5rem' }}>
                <Card.Body>
                    <Card.Text>{props.titleCrear}</Card.Text>
                    <Button variant="primary" onClick={props.crear}>Crear</Button>
                    <hr />
                    <Card.Text>{props.titleListar}</Card.Text>
                    <Button variant="primary" onClick={props.listar}>Listar</Button>
                    <hr />
                    <Card.Text>{props.titleBuscar}</Card.Text>
                    <Form id="formBuscar" onSubmit={props.buscar}>
                        <Form.Group>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa ID"
                                id="inputID"
                                style={{ marginBottom: '20px' }}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Buscar</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

