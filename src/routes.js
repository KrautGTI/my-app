import React, { Component } from 'react'
import { Route, Switch, withRouter } from "react-router-dom";

import withTracker from './components/misc/WithTracker';
import { Page404 } from "./components/misc/Page404";

// Pages
import Home from './components/pages/Home'
import About from './components/pages/About';
import WhySolar from './components/pages/WhySolar';
import BonusReferrals from './components/pages/BonusReferrals';
import CommercialSolar from './components/pages/CommercialSolar';
import SolarQuote from './components/pages/SolarQuote';
import Login from './components/pages/Login';
import FAQ from './components/pages/FAQ';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={withTracker(Home)} />
                <Route exact path="/about" component={withTracker(About)} />
                <Route exact path="/why-solar" component={withTracker(WhySolar)} />
                <Route exact path="/bonus-referrals" component={withTracker(BonusReferrals)} />
                <Route exact path="/commercial-solar" component={withTracker(CommercialSolar)} />
                <Route exact path="/solar-quote" component={withTracker(SolarQuote)} />
                <Route exact path="/faq" component={withTracker(FAQ)} />
                <Route exact path="/login" component={withTracker(Login)} />
                <Route component={withTracker(Page404)} />
            </Switch>
        )
    }
}

export default withRouter(Routes);