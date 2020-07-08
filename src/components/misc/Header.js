import React, { Component } from 'react'
import { NavLink, withRouter } from "react-router-dom";
import '../../assets/css/Hamburger.css';
import "../../assets/css/Header.css";

class Header extends Component {
    constructor(props) {
        super(props)
    
        this.hamburgerRef = React.createRef();
        this.navLinksRef = React.createRef();
    }

    componentDidMount(){
        if(this.hamburgerRef && this.navLinksRef){
            document.body.addEventListener('click', () => {
                this.hamburgerRef.current.classList.toggle("active");
                this.navLinksRef.current.classList.toggle("responsive")
              });
        }
    }

    componentWillUnmount(){
        this.hamburgerRef.current.removeEventListener("click");
    }

    render() {
        return (
            <header>
                <nav className="nav-container">
                    <NavLink to="/">
                        <img
                            className="nav-logo"
                            alt="logo"
                            src={require("../../assets/images/logos/logo.png")}
                        />
                        <span className="nav-l-text">Prestige Power</span>
                    </NavLink>
                    <a className="hamburger" href="# ">
                        <svg className="ham hamRotate ham4" viewBox="0 0 100 100" ref={this.hamburgerRef}>
                            <path
                                    className="line top"
                                    d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
                            <path
                                    className="line middle"
                                    d="m 70,50 h -40" />
                            <path
                                    className="line bottom"
                                    d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
                        </svg>
                    </a>
                    <div className="nav-links" ref={this.navLinksRef}>
                        <NavLink 
                            exact
                            to="/why-solar" 
                            className="nav-link" 
                            activeClassName="nav-select">
                            Why Solar?
                        </NavLink>
                        <NavLink 
                            exact
                            to="/about" 
                            className="nav-link" 
                            activeClassName="nav-select">
                            About Us
                        </NavLink>
                        <NavLink 
                            exact
                            to="/bonus-referrals" 
                            className="nav-link" 
                            activeClassName="nav-select">
                            Bonus Referrals
                        </NavLink>
                        <NavLink 
                            exact
                            to="/commercial-solar" 
                            className="nav-link" 
                            activeClassName="nav-select">
                            Commercial Solar
                        </NavLink>
                        <NavLink 
                            exact
                            to="/login" 
                            className="nav-link" 
                            activeClassName="nav-select">
                            Login
                        </NavLink>
                    </div>
                </nav>
            </header>
        )
    }
}

export default withRouter(Header);