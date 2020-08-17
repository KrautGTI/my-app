import React, { Component } from 'react'
import ReferralForm from '../forms/ReferralForm'
import { Helmet } from 'react-helmet';

export default class BonusReferrals extends Component {
    render() {
        return (
            <div className="wrapper">
                <Helmet>
                    <title>Bonus Referrals | Prestige Power</title>
                </Helmet>
                <h1>Bonus Referrals</h1>
                <h3 className="green">Refer a family or friend to receive a $1,000 referral bonus!</h3>
                <ReferralForm user={this.props.user} />
            </div>
        )
    }
}
