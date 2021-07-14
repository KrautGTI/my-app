import React, { Component } from 'react'
import SolarQuoteForm from '../forms/SolarQuoteForm'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Background from '../../assets/images/backgrounds/hero.png';

export default class SolarQuote extends Component {
    render() {
        var topBgImageStyle = {
            width: "100%",
            height: "200px",
            backgroundImage: `url(${Background})`,
            backgroundPosition: "50% 70%", // change me around to move up and down!
            backgroundSize: "cover"
          };
        return (
            <>
            <div style ={ topBgImageStyle }></div>
            <div className="wrapper-w-img">
                <Helmet>
                    <title>Solar Quote | Prestige Power</title>
                </Helmet>
                <h1>Solar Quote</h1>
                <p>Want to talk to one of our sales representatives right away? Give us a call at <span className="green">(949) 636-8339</span>!</p>

                <SolarQuoteForm user={this.props.user} commercialPage={false} />

                <br/>
                <hr/>
                <br/>
                
                <h3 className="display-inline">Need a commercial solar quote?</h3>
                &nbsp;&nbsp;&nbsp;
                <Link to="/commercial-solar" className="btn animated-button victoria-one">Get a Commercial Quote</Link>
            </div>
            </>
        )
    }
}
