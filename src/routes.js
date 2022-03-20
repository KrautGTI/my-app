import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from "react-router-dom";

import withTracker from './components/misc/WithTracker';
import { Page404 } from "./components/misc/Page404";
import ErrorBoundary from './components/misc/ErrorBoundary';

// Pages
import Home from './components/pages/Home'
import About from './components/pages/About';
import WhySolar from './components/pages/WhySolar';
import BonusReferrals from './components/pages/BonusReferrals';
import CommercialSolar from './components/pages/CommercialSolar';
import SolarQuote from './components/pages/SolarQuote';
import Login from './components/pages/Login';
import FAQ from './components/pages/FAQ';
import Account from './components/pages/Account';
import LoggingIn from './components/pages/LoggingIn';
import AdminPanel from './components/pages/AdminPanel';


class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={withTracker(() => <Home user={this.props.user} />) } />
                <Route exact path="/about" component={withTracker(About)} />
                <Route exact path="/why-solar" component={withTracker(WhySolar)} />
                <Route exact path="/faq" component={withTracker(FAQ)} />
                <Route exact path="/bonus-referrals" component={withTracker(() => <BonusReferrals user={this.props.user} />) } />
                <Route exact path="/commercial-solar" component={withTracker(() => <CommercialSolar user={this.props.user} />) } />
                <Route exact path="/solar-quote" component={withTracker(() => <SolarQuote user={this.props.user} />) } />

                <VisitorRoute loggedIn={this.props.user} path="/login" component={withTracker(Login)} />
                <Route path="/logging-in" exact component={() => <LoggingIn user={this.props.user} />} />
                <UserRoute
                    exact
                    path="/admin-panel"
                    loggedIn={this.props.user}
                    component={() => <AdminPanel user={this.props.user} />} />
                <UserRoute
                    exact
                    path="/account"
                    loggedIn={this.props.user}
                    component={() => <Account user={this.props.user} />} />
                <Route component={withTracker(Page404)} />
            </Switch>
        )
    }
}

// Must be signed in to view
const UserRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
    return (
      <Route
        path={path}
        {...rest}
        render={props => {
          return loggedIn ? (
            <ErrorBoundary><Comp {...props} /></ErrorBoundary>
          ) : (
            
            <Route
              render={() => (
                <>
                  {alert("You must sign in to visit that page.")}
                  <Redirect to="/login" />
                </>
              )}
            />
          );
        }}
      />
    );
  };
  
    // Must be signed out to view
    const VisitorRoute = ({ component: Comp, loggedIn, path }) => {
      return (
        <Route
          path={path}
          render={props => {
            return loggedIn ? (
              <Route
                render={() => (
                  <>
                    {alert("You must be signed out to visit that page.")}
                    <Redirect to="/" />
                  </>
                )}
              />
            ) : (
              <ErrorBoundary><Comp {...props} /></ErrorBoundary>
            );
          }}
        />
      );
    };

export default withRouter(Routes);