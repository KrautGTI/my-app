import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = { 
          year: new Date().getFullYear(),
        };
    }

    render() {
        return (
            <footer>
                <hr/>
                <div className="f-container">
                    <dic className="s-margin-l left">
                        <Link to="/faq">F.A.Q</Link>
                    </dic>


                    <div className="center">
                        &copy;
                        {' '}
                        {this.state.year}
                        {' '}
                        Prestige Power
                        {/* TODO: put logo tiny here */}
                    </div>

                    <div className="right">
                        <a href="https://twitter.com/GoPrestigePower" className="icon-button twitter">
                            <i className="fab fa-twitter icon-twitter" />
                            <span></span>
                        </a>
                        <a href="https://www.facebook.com/GoPrestigePowerUSA" className="icon-button facebook">
                            <i className="fab fa-facebook icon-facebook"/>
                            <span></span>
                        </a>
                        <a href="https://www.yelp.com/biz/go-prestige-power-mission-viejo" className="icon-button yelp">
                            <i className="fab fa-yelp icon-yelp"/>
                            <span></span>
                        </a>
                    </div>
                    
                </div>
                {/* TODO: add FAQ link */}
                
            </footer>
        )
    }
}
