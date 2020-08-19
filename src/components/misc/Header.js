import React, { Component } from 'react'
import { NavLink, withRouter } from "react-router-dom";
import '../../assets/css/Hamburger.css';
import "../../assets/css/Header.css";
import { fire } from "../../Fire.js";
import { store } from 'react-notifications-component';

class Header extends Component {
    constructor(props) {
        super(props)
    
        this.hamburgerRef = React.createRef();
        this.signOut = this.signOut.bind(this);
        this.navLinksRef = React.createRef();
    }

    componentDidMount(){
        if(this.hamburgerRef && this.navLinksRef){
            this.hamburgerRef.current.addEventListener('click', () => {
                this.hamburgerRef.current.classList.toggle("active");
                this.navLinksRef.current.classList.toggle("responsive")
              });

        }
    }

    componentWillUnmount(){
        this.hamburgerRef.current.removeEventListener("click");
    }

    signOut(){
        console.log("Signing out...")
        fire.auth().signOut().then(() => {
          console.log("Sign out successful.");
          store.addNotification({
            title: "Success",
            message: "Sign out successful.",
            type: "success",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          })
          this.props.history.push("/");
          window.location.reload();
        }).catch((error) => {
          console.error("Error signing out: " + error);
          store.addNotification({
            title: "Error",
            message: `Error signing out: ${error}`,
            type: "danger",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          })
        });
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
                            to="/faq" 
                            className="nav-link" 
                            activeClassName="nav-select">
                            F.A.Q
                        </NavLink>
                        <NavLink to="/solar-quote" className="btn btn-sm animated-button doug-one">Free Solar Quote</NavLink>
                        {this.props.user && (
                            <>
                            <NavLink to="/account" exact className="nav-link" activeClassName="nav-select">Account</NavLink>
                            <NavLink to="/" className="nav-link" onClick={this.signOut}>Sign out</NavLink>
                            </>
                        )}
                        {!this.props.user && (
                            <>
                            <NavLink to="/login" exact className="nav-link" activeClassName="nav-select">Login</NavLink>
                            </>
                        )}
                        
                    </div>
                </nav>
                <hr className="s-margin-t no-padding"/>
            </header>
        )
    }
}


export default withRouter(Header)