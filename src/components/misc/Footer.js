import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from "react-responsive";

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
                <div className="f-container">
                    <MediaQuery minWidth={901}>
                        <div className="left">
                            &nbsp;&nbsp;<Link to="/faq">F.A.Q</Link> | <Link to="/commercial-solar">Commercial Solar</Link>{!this.props.user && (<>&nbsp;| <Link to="/login">Login</Link></>)}&nbsp;&nbsp;
                        </div>

                        <div className="center">
                            <div className="center-text">
                                <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/GoPrestigePower" className="icon-button twitter">
                                    <i className="fab fa-twitter icon-twitter" />
                                    <span></span>
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/GoPrestigePowerUSA" className="icon-button facebook">
                                    <i className="fab fa-facebook icon-facebook"/>
                                    <span></span>
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.yelp.com/biz/go-prestige-power-mission-viejo" className="icon-button yelp">
                                    <i className="fab fa-yelp icon-yelp"/>
                                    <span></span>
                                </a>
                            </div>
                            &copy;
                            {' '}
                            {this.state.year}
                            {' '}
                            Prestige Power
                        </div>

                        <div className="right">
                            <a href="https://www.douglasrcjames.com" target="_blank" rel="noopener noreferrer"><i className="fas fa-tools"/> by douglasrcjames</a> 
                            &nbsp;&nbsp;
                        </div>
                    </MediaQuery>
                    <MediaQuery maxWidth={900}>
                        <div>
                            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/GoPrestigePower" className="icon-button twitter">
                                <i className="fab fa-twitter icon-twitter" />
                                <span></span>
                            </a>
                            &nbsp;&nbsp;
                            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/GoPrestigePowerUSA" className="icon-button facebook">
                                <i className="fab fa-facebook icon-facebook"/>
                                <span></span>
                            </a>
                            &nbsp;&nbsp;
                            <a target="_blank" rel="noopener noreferrer" href="https://www.yelp.com/biz/go-prestige-power-mission-viejo" className="icon-button yelp">
                                <i className="fab fa-yelp icon-yelp"/>
                                <span></span>
                            </a>
                        </div>
                        <div>
                            &copy;
                            {' '}
                            {this.state.year}
                            {' '}
                            Prestige Power
                        </div>
                        <div>
                        <a href="https://www.douglasrcjames.com" target="_blank" rel="noopener noreferrer"><i className="fas fa-tools"/> by douglasrcjames</a> 
                        </div>
                        <div>
                            &nbsp;&nbsp;<Link to="/faq">F.A.Q</Link> | <Link to="/commercial-solar">Commercial Solar</Link>{!this.props.user && (<>&nbsp;| <Link to="/login">Login</Link></>)}&nbsp;&nbsp;
                        </div>
                    </MediaQuery>
                </div>
                


            </footer>
        )
    }
}

