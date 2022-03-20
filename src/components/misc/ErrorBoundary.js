import React from 'react';
import {Link} from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="wrapper">
            <h2>Something went wrong</h2>
            {/* TODO: details not supported in Edge */}
            <details>  
                <summary>more info</summary>  
                {this.state.error && this.state.error.toString()}
            </details>
            <p>Sorry about this! Please contact <u className="blue">help@minute.tech</u> if the error persists.</p>
            <Link to="/"><button className="s-btn">Return to home page.</button></Link>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
export default ErrorBoundary;