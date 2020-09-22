import React, { Component } from 'react'
import SolarQuoteForm from '../forms/SolarQuoteForm'
import { Helmet } from 'react-helmet';
import Background from '../../assets/images/backgrounds/commercial-1.jpg';

export default class CommercialSolar extends Component {
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
                    <title>Commercial Solar | Prestige Power</title>
                </Helmet>
                <h1>Commercial Solar</h1>
                <p>
                    Do you know a business owner who is looking to reduce recurring energy costs? Prestige
                    Power connects commercial property owners with the best commercial solar installers in the
                    industry. Our installers offer zero down, financing, and cash options for businesses that qualify.
                    We also offer Prestige Power customers a referral bonus for referring residential and
                    commercial customers who get installed. The bonus for referral of a residential
                    customer is $500. The bonus for referral of a commercial customer is $3,000. All bonuses are
                    paid after the referred customer’s installation and will arrive within 2-3 weeks in the form of a
                    check.
                </p>

                <h4>Benefits include:</h4>
                <ul>
                    <li>26% Federal Tax Credit (ITC)</li>
                    <li>Zero upfront cost, financing, and cash purchase options</li>
                    <li>Return on investment within 2-10 years depending on market</li>
                    <li>Increase property value</li>
                    <li>Reduces operating costs</li>
                    <li>Positive impact on the environment</li>
                </ul>
                <hr/>
                <h2>Your Business Information</h2>
                <SolarQuoteForm user={this.props.user} commercialPage={true}/>

                <h4 className="center-text">Contact us directly @ <u>commercial@goprestigepower.com</u> for more questions!</h4>
            </div>
            </>
        )
    }
}
