import React, { Component } from 'react'
import { Helmet } from 'react-helmet-async';
export default class About extends Component {
    render() {
        return (
            <div className="wrapper">
                <Helmet>
                    <title>About Us | Prestige Power</title>
                </Helmet>
                <h1>
                    About Us  
                    <a href="https://www.sunrun.com/" target="_blank" rel="noopener noreferrer">
                        <img
                            className="responsive right medium s-padding"
                            alt="sunrun"
                            src={require("../../assets/images/logos/sunrun-partner.png")}
                            /> 
                    </a>
                    
                </h1>
                
                <p>
                    Prestige Power offers homeowners the opportunity to say goodbye to high utility bills and
                    hello to solar savings. We are dedicated to assisting homeowners in transitioning to renewable
                    energy and saving money at the same time.
                </p>
                <p>
                    We provide qualified customers with options and services that are tailored to their needs. Our
                    representatives assist each homeowner in selecting the installation that is best for his/her
                    home. Whether you’re interested in buying a solar panel system outright, or taking part in our
                    no-cost “Solar as Service” program, we can quickly present your options with honesty and
                    transparency.
                </p>
                <p>
                    Our mission is to rescue homeowners from their unpredictable, ever increasing utility
                    rates. As a company, we strive to educate homeowners on how they are currently
                    charged for electric power, and what they can do about it by switching to solar energy.
                    We assist homeowners in saving money while helping the planet, one footprint at a
                    time.
                </p>

                
                <div className="center-text">
                    <h2>Proud Sponsor of California Polytechnic State University</h2>
                    <img
                        className="responsive large s-padding"
                        alt="cal poly"
                        src={require("../../assets/images/logos/calpoly.png")}
                        /> 
                </div>
                
                <h2>Our Team</h2>
                <p>Coming soon!</p>
                
            </div>
        )
    }
}
