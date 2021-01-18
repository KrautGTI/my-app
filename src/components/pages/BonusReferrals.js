import React, { Component } from 'react'
import ReferralForm from '../forms/ReferralForm'
import { Helmet } from 'react-helmet-async';
import Background from '../../assets/images/backgrounds/friends.jpg';

export default class BonusReferrals extends Component {
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
                    <title>Bonus Referrals | Prestige Power</title>
                </Helmet>
                <h1>Bonus Referrals</h1>
                <h3 className="green">Refer a family or friend to receive a $500 referral bonus!</h3>
                <ReferralForm user={this.props.user} />
            </div>
            </>
        )
    }
}
