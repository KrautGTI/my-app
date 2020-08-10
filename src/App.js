import React, {Component} from 'react';
import { Router } from 'react-router-dom';

// Dialogue
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Modal from 'react-modal'

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
import "./assets/css/Modal.css"; 

// This component fixes bug where new page load would sometimes be in the middle or bottom
import ScrollToTop from "./components/misc/ScrollToTop";

// For React Modals: was getting a console error: 
// https://github.com/reactjs/react-modal/issues/576
if (typeof(window) !== 'undefined') {
  Modal.setAppElement('body')
}

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
      // optional configuration
      const options = {
        // you can also just use 'bottom center'
        position: positions.TOP_CENTER,
        // containerStyle: {
        //   backgroundColor: '#032632'
        // },
        timeout: 5000,
        offset: '30px',
        // you can also just use 'scale'
        transition: transitions.SCALE
      }
      
      return (
        <AlertProvider template={AlertTemplate} {...options}>
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
        </AlertProvider>
    );
  }
}

export default App;
