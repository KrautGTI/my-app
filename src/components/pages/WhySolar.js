import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Helmet } from 'react-helmet-async';
import Background from '../../assets/images/backgrounds/solar-1.jpg';

export default class WhySolar extends Component {
    render() {
        var topBgImageStyle = {
            width: "100%",
            height: "200px",
            backgroundImage: `url(${Background})`,
            backgroundPosition: "50% 50%", // change me around to move up and down!
            backgroundSize: "cover"
          };
        return (
            <>
            <div style ={ topBgImageStyle }></div>
            <div className="wrapper-w-img">
                <Helmet>
                    <title>Why Solar? | Prestige Power</title>
                </Helmet>
                <h1>Why Solar?</h1>
                <p>
                    In today’s world, people are concerned about the impact that everyday living has on the
                    environment. That’s where we come in. Prestige Power is a certified dealer for the nation’s
                    leading solar company, Sunrun. We work together to provide homeowners with elite service
                    and seamless conversion to renewable energy. Solar power allow homeowners to save on
                    energy costs while benefitting the environment. Together, we can make the world a better
                    place.
                </p>

                <p>
                    Each solar installation comes with a 25 year warranty as well as a production guarantee from
                    Sunrun. If you don’t use all of the power that your system produces, you have the option
                    to roll over your excess power to the following year, or sell it back to your power company.
                    With a solar installation, you can save money on energy costs and potentially earn money as
                    well!
                </p>

                <p>
                    Solar power allows homeowners to produce their own, clean energy, while often saving
                    tens of thousands of dollars over time. A solar installation is also transferable if you wish to
                    move and even adds value to your home at no cost to you. That’s a no brainer, right?
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
                

                <Grid fluid className="s-padding-t">
                    <Row center="xs">
                        <Col xs={12} sm={3}>
                            <img
                                className="responsive small"
                                alt="light bulb"
                                src={require("../../assets/images/icons/light-bulb.png")}
                            /> 
                            <h2>Save Money</h2>
                            <p>
                                Electricity bills are skyrocketing. By installing solar panels on your home, you can now harness
                                the sun's energy to meet all of your electricity needs and eliminate rate increases and
                                unpredictability from your utility company. Each home has a unique solar potential based
                                upon kilowatt usage and the direction, pitch and shading of the roof. Cost savings may vary,
                                but all homeowners save money using solar energy.
                            </p>
                        </Col>
                        <Col xs={12} sm={3}>
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
                        <Col xs={12} sm={3}>
                            <img
                                className="responsive small"
                                alt="eco home"
                                src={require("../../assets/images/icons/eco-home.png")}
                            /> 
                            <h2>Sustainability</h2>
                            <p>
                                Renewable solar power is the future of energy. Prestige Power specializes in providing
                                homeowners with the peace of mind of knowing exactly what their
                                electricity bills will be each month with no surprises. Homeowners who choose the “Solar as
                                Service” option have their rates locked in below the electric company’s residential rates for the
                                next 25 years.
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
                                services, use the tab provided above to schedule an appointment with one of our
                                knowledgeable sales representatives. Get your FREE quote today!
                            </p>
                        </Col>
                    </Row>
                    <Row center="xs">
                        <Col className="s-text m-margin-t">
                            <b>Disclaimer:</b>
                            <p>Each home has a unique solar potential based on kilowatt usage and the direction, pitch, and shading of the roof. Cost savings may vary.</p>
                        </Col>
                    </Row>
                </Grid>

                <hr/>
                <br/>

                <h2>No Cost Solar</h2>
                <p>
                    Imagine being able to switch who you buy your electricity from and save money instantly.
                    Depending on existing electric company rates, homeowners who convert to solar power
                    using the “Solar as Service” option often save up to 20-50% on their electric bills with no out
                    of pocket costs. If your property qualifies for the “Solar as Service” program, you are able to
                    lock in your kilowatt price and gain the peace of mind of predictability in your electric bills.
                    Sunrun will pay for the site survey, permitting, installation, and monitoring, and
                    will even speak with your HOA if needed. We strive to make going green simple.
                </p>
                <br/>
                <br/>
                <br/>
            </div>
            </>
        )
    }
}
