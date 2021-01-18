import React, { Component } from 'react'
import { Formik, Field } from "formik";
import { withRouter, Link } from 'react-router-dom';

import { firebase, fire } from "../../Fire.js";
import { logInSchema } from "../../utils/formSchemas"
import { ForgotPassword } from '../forms/ForgotPassword.js';
import { store } from 'react-notifications-component';
import { Helmet } from 'react-helmet-async';

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
          showModal: false
        }
    }
    
    handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
    }
  
    handleOpenModal = () => {
      this.setState({ showModal: true });
    }

    handleCloseModal = () => {
      this.setState({ showModal: false });
    }

    signIn = (values) => {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
        'callback': (response) => {
          // reCAPTCHA solved, allow signIn.
          fire.auth().signInWithEmailAndPassword(values.email, values.password).then((user) => {
              console.log("Sign in success!")
              this.props.history.push("/logging-in");
              window.location.reload();
          }).catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log("Error signing in: " + errorCode + ": " + errorMessage)
              store.addNotification({
                title: "Error",
                message: `Error signing in: ${errorMessage}`,
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
              window.recaptchaVerifier.clear()
          });
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          store.addNotification({
            title: "Error",
            message: `Please solve the reCAPTCHA again.`,
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
          window.recaptchaVerifier.clear()
        }
      })
      window.recaptchaVerifier.render()
    }

    sendPasswordReset = (values) => {
      fire.auth().sendPasswordResetEmail(values.email).then(() => {
        store.addNotification({
          title: "Success",
          message: "Reset link has been sent to your email.",
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
      }).catch((error) => {
        store.addNotification({
          title: "Error",
          message: `Error sending password reset link: ${error.message}`,
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
    const initialFormState = {
      email: "",
      password: ""
    }; 
    
    return (
        <div className="m-container">
          <Helmet>
            <title>Log in | Prestige Power</title>
          </Helmet>
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
                  <Link to="/solar-quote" className="s-padding-b">
                    Don't have an account?
                  </Link>
                </div>
                <div className="center-text">
                  <ForgotPassword
                    handleOpenModal={this.handleOpenModal}
                    showModal={this.state.showModal}
                    handleChange={this.handleChange}
                    sendPasswordReset={this.sendPasswordReset}
                    handleCloseModal={this.handleCloseModal}
                    wording={"Forgot password?"}
                    linkClass={"just-text-btn underline-hover text-hover"} />
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

export default withRouter(LogIn)
