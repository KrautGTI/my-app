import React, { Component } from 'react'
import SolarQuoteForm from '../misc/SolarQuoteForm'

export default class SolarQuote extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>Solar Quote</h1>
                <h3>LIMITED TIME OFFER: $1/Mo For 6 Months</h3>
                <p>Want to talk to one of our sales representatives right now? Give us a call at 949-636-8339!</p>

                <SolarQuoteForm />

                <br/>
                <hr/>
                <br/>
                
                <h3>Need a commercial solar quote?</h3>
                <button>Commercial solar quote</button>
            </div>
        )
    }
}
