import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import ContactForm from '../misc/ContactForm';

export default class Home extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>Home</h1>
                {/* TODO: update content */}
                <p>Welcome to Doug's React Boiler! Click around a bit, it's a clean slate for you!</p>
                <br/>
                <Grid fluid>
                    <Row center="xs">
                        <Col xs={12} sm={4}>
                            <h3>Column 1</h3>
                            <p>More information below</p>
                        </Col>
                        <Col xs={12} sm={4}>
                            <h3>Column 2</h3>
                            <p>More information below</p>
                        </Col>
                        <Col xs={12} sm={4}>
                            <h3>Column 3</h3>
                            <p>More information below</p>
                        </Col>
                    </Row>
                </Grid>
                <br/>
                <h1>Contact Us</h1>
                <ContactForm />
            </div>
        )
    }
}
