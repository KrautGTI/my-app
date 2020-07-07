import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class About extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1>About</h1>
                {/* TODO: update content */}
                <p>
                    This project was built from Doug's boilerplate for 
                    React.js <a rel="noopener noreferrer" href="https://github.com/facebook/create-react-app" target="_blank">dougs-react-boiler</a> used for web apps and was 
                    further bootstrapped from <a rel="noopener noreferrer" href="https://github.com/facebook/create-react-app" target="_blank">Create React App</a>. 
                    In this setup, we have Doug's base CSS library, base React components (like Header and Footer), directories structured, React Router ready to go, and more! 
                </p>

                <div className="center-text">
                    <button>
                        <Link to="/bad-link">See 404 error</Link>
                    </button>
                </div>

                <p>
                    Adding a bunch of text here so we know what a long page might look like! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis erat a 
                    nibh sagittis consequat. Nunc porttitor sapien sapien, ac mattis quam facilisis eu. Etiam et faucibus neque. Fusce sit amet fringilla quam. Nullam 
                    neque sapien, iaculis nec pellentesque ut, luctus ut risus. Nunc sit amet eros rhoncus, consectetur eros eget, dapibus neque. Duis auctor nisl 
                    tincidunt neque sodales tristique. Ut luctus molestie nisl non mollis. Aliquam interdum orci vel imperdiet laoreet. Mauris enim tortor, venenatis ut 
                    dignissim sit amet, luctus malesuada ex.
                </p>
                <p>
                    Donec molestie lectus vitae pretium finibus. Sed suscipit ut arcu eu feugiat. Etiam euismod elementum urna id pretium. Nunc in erat id dolor bibendum varius. 
                    Pellentesque sit amet felis fringilla, ultricies eros sed, scelerisque massa. Praesent hendrerit id risus nec luctus. Vestibulum diam libero, ultricies ac odio non, 
                    laoreet malesuada tellus. Donec eu enim ultricies, hendrerit elit quis, tempor nibh. Curabitur volutpat velit nibh, sed rhoncus nisi maximus non. Morbi eleifend 
                    sed lorem ac faucibus. Sed magna arcu, imperdiet cursus feugiat id, pulvinar eget nulla. Vivamus vitae molestie nunc, sit amet eleifend nisl. Vestibulum ut ante 
                    pharetra, congue nulla et, fermentum sem. Vestibulum tincidunt pulvinar iaculis.
                </p>
                <img src={require("../../assets/images/logos/logo512.png")} alt="logo" className="large responsive center" />
                <p>
                    Sed tristique mi felis, quis rhoncus felis pellentesque ac. Aenean condimentum eu felis sed lacinia. Nam eget maximus justo. Aliquam mollis lorem et magna viverra lacinia. 
                    Proin quam augue, fringilla a lobortis rhoncus, semper vel dui. Vestibulum gravida massa elit, vel sodales ex porttitor quis. Nam pretium tempor odio. Nam felis eros, 
                    pharetra a mi at, blandit malesuada ante. Aliquam erat volutpat. In hac habitasse platea dictumst. Vivamus eu auctor elit. Maecenas sit amet eros ac quam tincidunt 
                    fermentum quis sed lectus. Duis dui massa, tempor id orci a, placerat finibus mauris. Vestibulum non efficitur nulla, vitae tempor nunc. Proin sed auctor nisi. 
                    Vivamus venenatis aliquet erat, a facilisis nisl imperdiet vel.
                </p>
                <p>
                    Morbi condimentum fringilla sem vitae convallis. Integer ultricies mauris velit. Fusce varius mi quis tempor aliquet. Nunc iaculis lorem lobortis turpis imperdiet, 
                    a convallis libero tempor. Mauris efficitur lacinia pretium. Cras nec enim posuere, scelerisque ligula at, mollis orci. Quisque orci felis, dapibus tincidunt sem sed, 
                    elementum commodo diam. Maecenas sit amet nisi et sem faucibus placerat. Vivamus molestie tincidunt iaculis. Cras vulputate malesuada ligula. Nam id posuere massa. 
                    Donec libero est, consectetur pretium turpis at, laoreet rhoncus mi. Nam nec cursus purus. Maecenas cursus iaculis lacus, id mattis augue blandit vitae. 
                    Cras at tellus sit amet elit gravida rutrum at in arcu.
                </p>
                <p>
                    Pellentesque eu ipsum vitae tortor tempor volutpat. Quisque imperdiet consequat ante et congue. Aliquam a metus sed est elementum faucibus at vitae purus. 
                    Vestibulum at pellentesque massa, nec vehicula felis. Etiam lacus est, aliquet eget auctor vitae, accumsan eget tellus. Vestibulum pulvinar ante faucibus eleifend tincidunt. 
                    Phasellus lobortis fermentum ante eget vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam sem leo,
                     vehicula ac cursus ornare, porttitor at ante. Etiam lorem tellus, scelerisque non libero at, congue ultricies nisl. Cras vehicula quis ex vel ullamcorper. 
                     Sed ultrices massa at eros fringilla interdum.
                </p>
                
            </div>
        )
    }
}
