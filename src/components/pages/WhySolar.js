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

                <p>
                    We specialize in assisting homeowners to go solar at zero upfront cost. As long as you
                    meet the minimum power requirement of 2,000 kilowatt hours on the year, (roughly
                    $50/month), as well as have a credit score above 650, then you’re eligible to take
                    advantage of our “solar as a service” program.
                </p>

                <h4>Benefits include:</h4>
                <ul>
                    <li>Exit your ever increasing electric company</li>
                    <li>Earn money off producing your own clean energy</li>
                    <li>Production guarantee over 25 years</li>
                    <li>26% Federal Tax Credit (ITC)</li>
                    <li>Full 25 year warranty and insurance on solar system</li>
                    <li>Increase home value and sell at faster rate</li>
                    <li>Full transfer guarantee to next homeowner</li>
                    <li>Return on investment within 7-10 years depending on market</li>
                    <li>Positive impact on the environment</li>
                </ul>
                

                <Grid fluid className="m-margin-t-b">
                    <Row center="xs">
                        <Col sm={12} md={4}>
                            <img
                                className="responsive small"
                                alt="light bulb"
                                src={require("../../assets/images/icons/light-bulb.png")}
                            /> 
                            <h2>Save money on your utility rates</h2>
                            <p>
                                Electricity bills are skyrocketing. By installing solar panels on your home, you can harness the suns energy to 
                                meet all of your electricity needs and eliminate rate increases and unpredictability from your utility company.
                            </p>
                        </Col>
                        <Col sm={12} md={4}>
                            <img
                                className="responsive small"
                                alt="wholesale"
                                src={require("../../assets/images/icons/wholesale.png")}
                            /> 
                            <h2>No cost to you</h2>
                            <p>
                                As long as your property qualifies, we provide hassle free design, permitting, installation, and monitoring. All at <i>no cost</i>!
                            </p>
                        </Col>
                        <Col sm={12} md={4}>
                            <img
                                className="responsive small"
                                alt="eco home"
                                src={require("../../assets/images/icons/eco-home.png")}
                            /> 
                            <h2>Sustainability for your future</h2>
                            <p>
                                Renewable solar power is the future of energy. We specialize in solar installations that provide homeowners with the “peace of mind” of 
                                knowing exactly what their electricity bills will be every month with no surprises. When you install “solar as a service,” your rate 
                                will be locked in below your utility company’s residential rate for the next 25 years.
                            </p>
                        </Col>
                    </Row>
                    <Row center="xs">
                        <Col xs={12} sm={6}>
                            <img
                                className="responsive small"
                                alt="phone"
                                src={require("../../assets/images/icons/phone-call.png")}
                            /> 
                            <h2>More Questions?</h2>
                            <p>
                                If you would like to learn more about solar power, or have questions about our services, schedule an appointment with one of 
                                our knowledgeable sales representatives today and get your FREE quote!
                            </p>
                        </Col>
                    </Row>
                    <Row center="xs">
                        <Col className="s-text m-margin-t-b">
                            <b>Disclaimer:</b>
                            <p>Each home has a unique solar potential based on kilowatt usage and the direction, pitch, and shading of the roof. Cost savings may vary.</p>
                        </Col>
                    </Row>
                </Grid>

                <hr/>
                <br/>

                <h2>No Cost Solar</h2>
                <p>More information coming soon!</p>
                <br/>
                <br/>
                <br/>
            </div>
        )
    }
}
