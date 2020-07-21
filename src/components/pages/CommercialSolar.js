import React, { Component } from 'react'
import SolarQuoteForm from '../misc/SolarQuoteForm'

export default class CommercialSolar extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>Commercial Solar</h1>
                <p>
                    Do you know of a business owner that is looking to cut costs on recurring payments?
                    Here at Prestige Power we connect you with the best commercial solar power service
                    in the industry. We help offer zero down, financing, and cash options for any business
                    that qualifies.
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
                <SolarQuoteForm />
                {/* 
                    First, Last name
                    Phone
                    Email
                    Business name/address
                    More information 
                */}

                <h4 className="center-text">Contact us directly @ commercial@goprestigepower.com for more questions!</h4>
            </div>
        )
    }
}
