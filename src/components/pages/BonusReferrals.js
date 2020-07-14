import React, { Component } from 'react'
import ReferralForm from '../misc/ReferralForm'

export default class BonusReferrals extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>Bonus Referrals</h1>
                <p>Refer a family or friend to receive a $1,000 referral bonus!</p>
                <ReferralForm />
            </div>
        )
    }
}
