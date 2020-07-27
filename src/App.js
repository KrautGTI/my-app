import React from 'react';
import { Router } from 'react-router-dom';

import history from './history';
import Routes from "./routes";

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

function App() {
  return (
    <Router history={history}>
      <ScrollToTop>
        <Header />
        <Routes />
        <Footer />
      </ScrollToTop>
    </Router>
  );
}

export default App;
