import React, { Component } from 'react'
import ReferralForm from '../misc/ReferralForm'

export default class BonusReferrals extends Component {
    render() {
        return (
            <div className="container">
                <h1>Bonus Referrals</h1>
                <h3 className="green">Refer a family or friend to receive a $1,000 referral bonus!</h3>
                <ReferralForm />
            </div>
        )
    }
}
