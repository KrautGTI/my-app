import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Grid, Row, Col } from 'react-flexbox-grid';
import ContactForm from '../forms/ContactForm';
import { Helmet } from 'react-helmet-async';

export default class Home extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Home | Prestige Power</title>
                </Helmet>
                <div className="hero-container-large">
                    <div className="hero-image-1">
                        <div className="hero-text text-shadow">
                            <h1 className="s-margin-b no-padding ">Solar &amp; Battery</h1>
                            <h2 className="s-margin-b no-padding">Sustainability for your future</h2>
                            <Link to="/solar-quote" className="btn btn-md animated-button doug-one">Request Free Quote</Link>
                        </div>
                    </div>
                </div>
                
                <div className="wrapper">
                    <h1 className="center-text">Why Solar?</h1>
                    <p className="l-width center">
                        In today’s world, many people are concerned about the impact that everyday living has on the environment. 
                        Solar power allows homeowners to produce their own, clean energy, while saving tens of thousands of dollars doing so. 
                        A solar installation even adds value to a homeowner’s property at no cost to the homeowner. That’s truly a no brainer, right?
                    </p>
                    
                    <div className="center-text m-margin-b">
                        <Link to="/why-solar" className="btn btn-sm animated-button victoria-two">Learn more</Link>
                    </div>
                    <Grid fluid>
                        <Row center="xs">
                            <Col sm={12} md={3}>
                                <img
                                    className="responsive small"
                                    alt="light bulb"
                                    src={require("../../assets/images/icons/light-bulb.png")}
                                /> 
                                <h2>Save Money</h2>
                                <p>
                                    Electricity bills are skyrocketing. By installing solar panels on your home, you can now harness
                                    the sun's energy to meet all of your electricity needs. Cost savings may vary,
                                    but all homeowners save money using solar energy.
                                </p>
                            </Col>
                            <Col sm={12} md={3}>
                                <img
                                    className="responsive small"
                                    alt="wholesale"
                                    src={require("../../assets/images/icons/wholesale.png")}
                                /> 
                                <h2>No Cost</h2>
                                <p>
                                    As long as your property qualifies, Prestige Power helps provide homeowners with hassle-free
                                    design, permitting, installation, and monitoring. All at <i>no cost</i>!
                                </p>
                            </Col>
                            <Col sm={12} md={3}>
                                <img
                                    className="responsive small"
                                    alt="eco home"
                                    src={require("../../assets/images/icons/eco-home.png")}
                                /> 
                                <h2>Sustainability</h2>
                                <p>
                                    Renewable solar power is the future of energy. Prestige Power specializes in providing
                                    homeowners with the peace of mind of knowing exactly what their
                                    electricity bills will be each month with no surprises. 
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
                                <h2>More Questions</h2>
                                <p>
                                    If you would like to learn more about solar power or have questions about Prestige Power’s
                                    services, schedule an appointment with one of our
                                    knowledgeable sales representatives. 
                                </p>
                                <Link to="/solar-quote" className="just-text-btn green text-hover">Get your FREE quote today!</Link>
                            </Col>
                        </Row>
                        <Row center="xs">
                            <Col className="s-text m-margin-t">
                                <b>Disclaimer:</b>
                                <p>Each home has a unique solar potential based on kilowatt usage and the direction, pitch, and shading of the roof. Cost savings may vary.</p>
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <div className="hero-container-large">
                    <div className="hero-image-2">
                        <div className="hero-text text-shadow">
                            <h1 className="s-margin-b no-padding ">Commercial Solar</h1>
                            <h2 className="s-margin-b no-padding">Have a big project? We work on projects of all sizes.</h2>
                            <Link to="/commercial-solar" className="btn btn-md animated-button doug-one">Request Free Commercial Quote</Link>
                        </div>
                    </div>
                </div>
               
                <div className="wrapper">
                    <h2>Have a question? Contact Us!</h2>
                    <ContactForm user={this.props.user} />
                </div>
                
            </div>
        )
    }
}
