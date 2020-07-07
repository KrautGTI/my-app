import React from 'react';
import { Router } from 'react-router-dom';

import history from './history';
import Routes from "./routes";

// Components
import Header from './components/misc/Header';
import Footer from './components/misc/Footer';

// CSS
import "./assets/css/Header.css";
import "./assets/css/Text.css";
import "./assets/css/Align.css";
import "./assets/css/Images.css";
import "./assets/css/Misc.css";

function App() {
  return (
    <Router history={history}>
      <Header />
      <Routes />
      <Footer />
    </Router>
  );
}

export default App;
