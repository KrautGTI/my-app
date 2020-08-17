import React, { Component } from 'react'
import SolarQuoteForm from '../forms/SolarQuoteForm'
import { Link } from 'react-router-dom';

export default class SolarQuote extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>Solar Quote</h1>
                <h3>LIMITED TIME OFFER: $1/Mo For 6 Months</h3>
                <p>Want to talk to one of our sales representatives right now? Give us a call at 949-636-8339!</p>

                <SolarQuoteForm user={this.props.user} commercialPage={false} />

                <br/>
                <hr/>
                <br/>
                
                <h3 className="display-inline">Need a commercial solar quote?</h3>
                &nbsp;&nbsp;&nbsp;
                <Link to="/commercial-solar" className="btn animated-button victoria-one">Get a Commercial Quote</Link>
            </div>
        )
    }
}
