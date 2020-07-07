import React, { Component } from 'react'

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
                <div className="center-text m-padding-t">
                    <hr/>
                    <br/>
                    &copy;
                    {' '}
                    {this.state.year}
                    {' '}
                    {/* TODO: update name */}
                    Doug's React Boiler
                </div>
            </footer>
        )
    }
}
