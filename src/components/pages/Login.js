import React, { Component } from 'react'
import { Formik, Field } from "formik";
import { withRouter, Link } from 'react-router-dom';

import { firebase, fire } from "../../Fire.js";
import { logInSchema } from "../../utils/formSchemas"

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
    }
  
    signIn(values) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
        'callback': (response) => {
          // reCAPTCHA solved, allow signIn.
          fire.auth().signInWithEmailAndPassword(values.email, values.password)
          .then(function(user) {
              console.log("Sign in success!")
              this.props.history.push("/logging-in");
              window.location.reload();
          }.bind(this))
          .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log("Error signing in: " + errorCode + ": " + errorMessage)
              this.props.alert.error("Error signing in: " + errorMessage)
              window.recaptchaVerifier.clear()
          });
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          this.props.alert.error("Please solve the reCAPTCHA again.")
          window.recaptchaVerifier.clear()
        }
      })
      window.recaptchaVerifier.render()
    }

  render() {
    const initialFormState = {
      email: "",
      password: ""
    }; 
    
    return (
        <div className="m-container">
          <h1>Log in</h1>
          <Formik
            initialValues={initialFormState}
            validationSchema={logInSchema}
            onSubmit={(values, actions) => {
                this.signIn(values);
            }}
            >
            {props => (
              <form onSubmit={props.handleSubmit}>
                <label htmlFor="email">Email: </label>
                <Field
                  type="email"
                  onChange={props.handleChange}
                  name="email"
                  value={props.values.email}
                  placeholder="john_doe@email.com" />
                {props.errors.email && props.touched.email ? (
                    <span className="yup-error">{props.errors.email}</span>
                ) : (
                    ""
                )}
                <br />
                <label htmlFor="password">Password: </label>
                <Field
                  type="password"
                  onChange={props.handleChange}
                  name="password"
                  value={props.values.password}
                  placeholder="*********************" />
                {props.errors.password && props.touched.password ? (
                    <span className="yup-error">{props.errors.password}</span>
                ) : (
                    ""
                )}
                <br />
                <div className="center-text">
                    <a className="btn btn-md animated-button victoria-one" href="# " onClick={(e) => props.handleSubmit(e)}>
                        <button type="submit" className="just-text-btn" disabled={!props.dirty && !props.isSubmitting}>Log in</button>
                    </a>
                </div>
                <br/>
                <div className="center-text">
                  <Link to="/solar-quote" className="grey-text-btn s-padding-b">
                    Don't have an account?
                  </Link>
                </div>
                <br/>
                <div id="recaptcha" className="p-container recaptcha"></div>
                <br/>
              </form>
            )}
          </Formik>
        </div>
      )
  }
}

export default withRouter(LogIn);
