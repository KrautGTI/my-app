import React, {Component} from 'react';
import { Router } from 'react-router-dom';

import history from './history';
import Routes from "./routes";
import { fire } from "./Fire.js";

// Components
import Header from './components/misc/Header';
import Footer from './components/misc/Footer';

// CSS
import "./assets/css/Text.css";
import "./assets/css/Align.css";
import "./assets/css/Images.css";
import "./assets/css/Misc.css";
import "./assets/css/Buttons.css"; 
import "./assets/css/Forms.css"; 

// This component fixes bug where new page load would sometimes be in the middle or bottom
import ScrollToTop from "./components/misc/ScrollToTop";

class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       loading: true
    }
  }

  componentDidMount(){
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  }

  render() {
      return (
        <Router history={history}>
          <ScrollToTop>
              <Header user={this.state.user} />
              { !this.state.loading && (
                <Routes user={this.state.user} />
              )}
              { this.state.loading && (
                <div className="l-container">
                  <h2 className="wrapper">Loading...</h2> 
                </div>
              )}
              <Footer />
          </ScrollToTop>
        </Router>
    );
  }
}

export default App;
