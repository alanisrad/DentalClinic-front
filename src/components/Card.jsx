import React from "react";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

export default function Tarjeta(props) {
    return (
        <Card style={{ width: '18rem', margin: '2rem' }}>
            <Card.Img variant="top" src={props.img} />
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Link to={props.link}>
                    <Button variant="primary">{props.portal}</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}