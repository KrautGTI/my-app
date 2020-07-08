import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';

export default class WhySolar extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>Why Solar?</h1>
                <p>
                    In today’s world, many people are concerned about the impact that everyday living has on the environment. 
                    Solar power allows homeowners to produce their own, clean energy, while saving tens of thousands of dollars doing so. 
                    A solar installation adds value to a homeowner’s property at no cost to the homeowner. That’s truly a no brainer, right?
                </p>
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
            </div>
        )
    }
}
