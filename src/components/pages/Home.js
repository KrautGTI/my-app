import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Grid, Row, Col } from 'react-flexbox-grid';
import ContactForm from '../misc/ContactForm';

export default class Home extends Component {
    render() {
        return (
            <div>
                <div className="hero-container-large">
                    <div className="hero-image-1">
                        <div className="hero-text text-shadow">
                            <h1 className="s-margin-b no-padding ">SOLAR &amp; STORAGE</h1>
                            <h2 className="s-margin-b no-padding">Just $1 a month for 6 months</h2>
                            <Link to="/solar-quote" className="btn btn-md animated-button doug-one">Request Free Quote</Link>
                        </div>
                    </div>
                </div>
                
                <div className="wrapper">
                    <h2 className="center-text">Why Solar?</h2>
                    <p>
                        In today’s world, many people are concerned about the impact that everyday living has on the environment. 
                        Solar power allows homeowners to produce their own, clean energy, while saving tens of thousands of dollars doing so. 
                        A solar installation adds value to a homeowner’s property at no cost to the homeowner. That’s truly a no brainer, right?
                    </p>
                    <div className="center-text m-margin-b">
                        <Link to="/why-solar" className="btn btn-sm animated-button victoria-two">Learn more</Link>
                    </div>
                    <Grid fluid>
                        <Row center="xs">
                            <Col sm={12} md={4}>
                                <h3>Save money on your utility rates</h3>
                                <p>
                                    Electricity bills are skyrocketing. By installing solar panels on your home, you can harness the suns energy to 
                                    meet all of your electricity needs and eliminate rate increases and unpredictability from your utility company.
                                </p>
                            </Col>
                            <Col sm={12} md={4}>
                                <h3>No cost to you</h3>
                                <p>
                                    As long as your property qualifies, we provide hassle free design, permitting, installation, and monitoring. All at <i>no cost</i>!
                                    </p>
                            </Col>
                            <Col sm={12} md={4}>
                                <h3>Sustainability for your future</h3>
                                <p>
                                    Renewable solar power is the future of energy. We specialize in solar installations that provide homeowners with the “peace of mind” of 
                                    knowing exactly what their electricity bills will be every month with no surprises. When you install “solar as a service,” your rate 
                                    will be locked in below your utility company’s residential rate for the next 25 years.
                                </p>
                            </Col>
                        </Row>
                        <Row center="xs">
                            <Col xs={12} sm={6}>
                                <h3>More Questions?</h3>
                                <p>
                                    If you would like to learn more about solar power, or have questions about our services, schedule an appointment with one of 
                                    our knowledgeable sales representatives today and get your FREE quote!
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>Disclaimer:</div>
                                <div>Each home has a unique solar potential based on kilowatt usage and the direction, pitch, and shading of the roof. Cost savings may vary.</div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
               
                <div className="wrapper">
                    <h2>Have a question? Contact Us!</h2>
                    <ContactForm />
                </div>
                
            </div>
        )
    }
}
