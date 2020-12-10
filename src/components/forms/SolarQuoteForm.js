import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Form, Field } from 'formik';
import { withRouter, Link } from "react-router-dom";
import { store } from 'react-notifications-component';

import { visitorSolarQuoteFormSchema, userSolarQuoteFormSchema } from '../../utils/formSchemas'
import { storage, firestore, firebase, fire } from "../../Fire.js";
import { validatePhone, genId } from '../../utils/misc';
import * as constant from "../../utils/constants.js";

class SolarQuoteForm extends Component {
    constructor(props) {
        super(props);
        this.showPassword = this.showPassword.bind(this);

        this.state = {
            passwordShown: false,
            filePath: null,
            fileUrl: "",
            fileProgress: 0
        }
    }
    
    addVisitorQuote = (values, resetForm) => {
        if(this.state.filePath && !this.state.fileUrl){
            // Case: User selected file, but didn't upload before submit
            store.addNotification({
                title: "Error",
                message: "A file was selected, but never uploaded. Tap the 'Upload bill' button before submitting or delete the file selection to continue.",
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
        } else {
            // Case: User either didn't select a file or selected a file properly
            if(this.state.passwordShown && (!values.password || !values.confirmPassword)){
                // Case: User may have intended to insert password for account, but didn't fill one of the password fields
                const confirmPasswordResponse = window.confirm("The password field was opened, but not finished. Did you want to continue anyways?");
                if(confirmPasswordResponse){
                    // Case: User doesn't care that the password wasn't inputted, creating client and building without account
                    firestore.collection('users').add({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phone: values.phone,
                        email: values.email,
                        business: values.business,
                        acquisition: values.acquisition,
                        solarReasons: values.solarReasons,
                        isAdmin: false,
                        assignedTo: { userId: "" },
                        timestamp: Date.now(),
                    }).then((docRef) => {
                        if(values.zip || values.averageBill || values.shaded || this.state.fileUrl){
                            // Case: User inputted at least one of the building fields
                            firestore.collection('buildings').add({
                                clientId: docRef.id,
                                zip: values.zip,
                                buildingName: values.buildingName,
                                status: constant.PENDING,
                                averageBill: values.averageBill,
                                proposalPref: values.proposalPref,
                                isCommercial: values.isCommercial,
                                shaded: values.shaded,
                                billUrl: this.state.fileUrl,
                                proposalUrl: "",
                                timestamp: Date.now(),
                            })
                            store.addNotification({
                                title: "Success",
                                message: "Submitted building proposal, you will hear from us soon.",
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
                        } else {
                            store.addNotification({
                                title: "Success",
                                message: "Submitted your inquiry, you will hear from us soon.",
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
                        }
                        
                        this.setState({
                            fileUrl: "",
                            filePath: "",
                            fileProgress: 0,
                            passwordShown: false
                        });
                        resetForm();
                        
                    });
                } else {
                    // Case: User wants to stay and input password.
                    console.log("User wants to stay and input password.")
                }  
            } else if(!this.state.passwordShown){
                // Case: User didn't show intent for making an account, proceed with just submitting form without account.
                firestore.collection('users').add({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phone: values.phone,
                    email: values.email,
                    business: values.business,
                    acquisition: values.acquisition,
                    solarReasons: values.solarReasons,
                    isAdmin: false,
                    assignedTo: { userId: "" },
                    timestamp: Date.now(),
                }).then((docRef) => {
                    if(values.zip || values.averageBill || values.shaded || this.state.fileUrl){
                        // Case: User inputted at least one of the building fields
                        firestore.collection('buildings').add({
                            clientId: docRef.id,
                            zip: values.zip,
                            buildingName: values.buildingName,
                            status: constant.PENDING,
                            averageBill: values.averageBill,
                            proposalPref: values.proposalPref,
                            shaded: values.shaded,
                            isCommercial: values.isCommercial,
                            billUrl: this.state.fileUrl,
                            proposalUrl: "",
                            timestamp: Date.now(),
                        })
                        store.addNotification({
                            title: "Success",
                            message: "Submitted building proposal, you will hear from us soon.",
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
                    } else {
                        store.addNotification({
                            title: "Success",
                            message: "Submitted your inquiry, you will hear from us soon.",
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
                    }
                    this.setState({
                        fileUrl: "",
                        filePath: "",
                        fileProgress: 0
                    });
                    resetForm();
                    
                });
            } else if(this.state.passwordShown && values.password && values.confirmPassword) {
                // Case: User is creating an account!
                if(values.password === values.confirmPassword){
                    store.addNotification({
                        title: "Info",
                        message: `Please fill out the recaptcha challenge before continuing!`,
                        type: "info",
                        insert: "top",
                        container: "top-center",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                      })
                    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
                        'callback': (response) => {
                          // reCAPTCHA solved, allow Ask.
                          fire.auth().createUserWithEmailAndPassword(values.email, values.password)
                            .then((userData) => {
                                console.log("userData: ")
                                console.log(userData)
                                // No existing user, now add to Firestore
                                var currentUser = fire.auth().currentUser;
                                console.log("currentUser: ")
                                console.log(currentUser)
                                currentUser.updateProfile({
                                  displayName: (values.firstName + " " + values.lastName)
                                }).then(() => {
                                    console.log("Successfully added display name to Firebase. Now adding their info...");
                                    if(values.zip || values.averageBill || values.shaded || this.state.fileUrl){
                                        // Case: User inputted at least one of the building fields
                                        firestore.collection('buildings').add({
                                            clientId: userData.user.uid,
                                            buildingName: values.buildingName,
                                            status: constant.PENDING,
                                            proposalPref: values.proposalPref,
                                            zip: values.zip,
                                            averageBill: values.averageBill,
                                            isCommercial: values.isCommercial,
                                            shaded: values.shaded,
                                            billUrl: this.state.fileUrl,
                                            proposalUrl: "",
                                            timestamp: Date.now()
                                        })
                                    }
                                    
                                    firestore.collection("users").doc(userData.user.uid).set({
                                        firstName: values.firstName,
                                        lastName: values.lastName,
                                        phone: values.phone,
                                        email: values.email,
                                        business: values.business,
                                        acquisition: values.acquisition,
                                        solarReasons: values.solarReasons,
                                        isAdmin: false,
                                        assignedTo: { userId: "" },
                                        timestamp: Date.now()
                                    }, { merge: true }).then(() => {
                                        console.log("Successful write to Firestore.");
                                        this.props.history.push("/account");
                                    }).catch((error) => {
                                        console.error("Error adding document: ", error);
                                        store.addNotification({
                                            title: "Error",
                                            message: `Error adding document: ${error}`,
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
                                }).catch((error) => {
                                  console.error("Error adding your display name to database: ", error);
                                  store.addNotification({
                                    title: "Error",
                                    message: `Error adding your display name to database: ${error}`,
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
                            
                            }).catch((error) => {
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log("Error registering: " + errorCode + ": " + errorMessage)
                                store.addNotification({
                                    title: "Error",
                                    message: `Error registering: ${error}`,
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
                            message: "Please solve the reCAPTCHA again.",
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
                } else {
                    store.addNotification({
                        title: "Error",
                        message: "Passwords you entered do not match! Try again.",
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
                }
            } else {
                store.addNotification({
                    title: "Error",
                    message: "Unknown case, please check fields and try again!",
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
            }
        }
    }

    addUserQuote = (values, resetForm) => {
        if(this.state.filePath && !this.state.fileUrl){
            // Case: User selected file, but didn't upload before submit
            store.addNotification({
                title: "Error",
                message: "A file was selected, but never uploaded. Tap the 'Upload bill' button before submitting or delete the file selection to continue.",
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
        } else {
            if(!values.zip){
                store.addNotification({
                    title: "Error",
                    message: "You must enter at least the ZIP code for us to help the property.",
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
            } else {
                // Case: User inputted at least one of the building fields
                firestore.collection('buildings').add({
                    clientId: this.props.user.uid,
                    status: constant.PENDING,
                    proposalPref: values.proposalPref,
                    zip: values.zip,
                    buildingName: values.buildingName,
                    averageBill: values.averageBill,
                    isCommercial: values.isCommercial,
                    shaded: values.shaded,
                    billUrl: this.state.fileUrl,
                    proposalUrl: "",
                    timestamp: Date.now(),
                }).then(() => {
                    this.setState({
                        fileUrl: "",
                        filePath: "",
                        fileProgress: 0
                    });
                    resetForm();
                    store.addNotification({
                        title: "Success",
                        message: "Submitted building proposal, you will hear from us soon.",
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
                        message: `Error adding building: ${error}`,
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
                })
            }
        }
    }

    handleFileChange = e => {
        if (e.target.files[0]) {
          const filePath = e.target.files[0];
          this.setState(() => ({ filePath }));
        }
      };

    handleFileUpload = (file) => {
        const randomId = genId(5)
        const uploadTask = storage.ref(`bills/${randomId}-${file.name}`).put(file);
        uploadTask.on(
          "state_changed",
          snapshot => {
            // progress function ...
            const fileProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ fileProgress });
          },
          error => {
            // Error function ...
            console.log(error);
          },
          () => {
            // complete function ...
            storage
              .ref(`bills/${randomId}-${file.name}`)
              .getDownloadURL()
              .then(fileUrl => {
                this.setState({ fileUrl });
              });
          }
        );
      };

    showPassword(e) {
        e.preventDefault(e)
        this.setState({ passwordShown: true });
    }
    
      
    render() {
        const initialFormState = {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            acquisition: "",
            buildingName: "",
            zip: "",
            averageBill: "",
            shaded: "",
            solarReasons: [],
            proposalPref: "",
            business: "",
            isCommercial: this.props.commercialPage === true ? "yes" : "",
            password: "",
            confirmPassword: ""
          };

        return (
            <div className="horiz-center">
                <Formik
                    initialValues={initialFormState}
                    
                    onSubmit={(values, actions) => {
                        if(this.props.user){
                            this.addUserQuote(values, actions.resetForm);
                        } else {
                            this.addVisitorQuote(values, actions.resetForm);
                        }
                        
                    }}
                    validationSchema={this.props.user ? userSolarQuoteFormSchema : visitorSolarQuoteFormSchema}
                    >
                    {props => (
                        <Form>
                            <Grid fluid>
                                <Row className={this.props.user ? "hide" : "s-margin-b"}>
                                    <Col sm={12} md={6}>
                                        <label>First name: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="John"
                                            name="firstName"
                                            value={props.values.firstName}
                                        />
                                        {props.errors.firstName && props.touched.firstName ? (
                                            <span className="red">{props.errors.firstName}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <label>Last name: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Doe"
                                            name="lastName"
                                            value={props.values.lastName}
                                        />
                                        {props.errors.lastName && props.touched.lastName ? (
                                            <span className="red">{props.errors.lastName}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row className={this.props.user ? "hide" : "s-margin-b"}>
                                    <Col sm={12} md={6}>
                                        <label>Phone: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            name="phone"
                                            required
                                            validate={validatePhone}
                                            onChange={props.handleChange}
                                            value={props.values.phone}
                                            type="text"
                                            placeholder={props.values.phone || `(123) 456-7890`}
                                        />
                                        {props.errors.phone && props.touched.phone ? (
                                            <span className="red">{props.errors.phone}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <label>Email: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="john_doe@gmail.com"
                                            name="email"
                                            value={props.values.email}
                                        />
                                        {props.errors.email && props.touched.email ? (
                                            <span className="red">{props.errors.email}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row className={this.props.user ? "hide" : "s-margin-b"}>
                                    <Col xs={12} sm={6} >
                                        <label>Business/Organization:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            onChange={props.handleChange}
                                            placeholder="Biz Movers LLC"
                                            name="business"
                                            value={props.values.business}
                                        />
                                        {props.errors.business && props.touched.business ? (
                                            <span className="red">{props.errors.business}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className={props.values.business ? "" : "hide"}>
                                        <label>Is this a commercial inquiry?</label>
                                        <br/>
                                        <Field
                                            component={RadioButton}
                                            name="isCommercial"
                                            id="yes"
                                            label="Yes"
                                        />
                                        <Field
                                            component={RadioButton}
                                            name="isCommercial"
                                            id="no"
                                            label="No"
                                        />
                                        {props.errors.isCommercial && props.touched.isCommercial ? (
                                            <span className="red">{props.errors.isCommercial}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row className={this.props.user ? "hide" : "s-margin-b"}>
                                    <Col sm={12} md={6}>
                                        <label>How did you hear about us?: </label>
                                        <br/>
                                        <Field 
                                            component="select" 
                                            name="acquisition" 
                                            value={props.values.acquisition}
                                            onChange={props.handleChange}
                                            >
                                            <option defaultValue value="">Not selected</option> 
                                            <option value="search">Search Engine</option>
                                            <option value="friend">Recommended by friend, family, or colleague</option>
                                            <option value="social">Social Media</option>
                                            <option value="publication">Blog or publication</option>
                                            <option value="partners">One of our partners</option>
                                            <option value="other">Other</option>
                                        </Field>
                                        {props.errors.acquisition && props.touched.acquisition ? (
                                            <span className="red">{props.errors.acquisition}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <div className={this.props.user ? "hide" : ""}>
                                    <br/>
                                    <hr/>
                                    <br/>
                                </div>
                                <Row className="s-margin-b">
                                    <Col xs={12} sm={6}>
                                        <label className="no-padding no-margin">Building Nickname:</label>
                                        <span className="s-text display-block">*This an unofficial name to identify the property</span>
                                        <Field
                                            type="text"
                                            onChange={props.handleChange}
                                            placeholder="Main St Garage"
                                            name="buildingName"
                                            value={props.values.buildingName}
                                        />
                                        {props.errors.buildingName && props.touched.buildingName ? (
                                            <span className="red">{props.errors.buildingName}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <label className="s-padding-b">ZIP Code:</label>
                                        <Field
                                            type="text"
                                            onChange={props.handleChange}
                                            placeholder="12345"
                                            name="zip"
                                            value={props.values.zip}
                                        />
                                        {props.errors.zip && props.touched.zip ? (
                                            <span className="red">{props.errors.zip}</span>
                                        ) : (
                                            ""
                                        )}  
                                    </Col>
                                </Row>
                                <Row className="s-margin-b">
                                    <Col xs={12} sm={6}>
                                        <label>What's the average power bill?</label>
                                        <br/>
                                        <Field 
                                            component="select" 
                                            name="averageBill" 
                                            value={props.values.averageBill}
                                            onChange={props.handleChange}
                                            >
                                            <option defaultValue value="">Not selected</option> 
                                            <option value="50">Under $100</option>
                                            <option value="150">$100-200/mo</option>
                                            <option value="250">$200-300/mo</option>
                                            <option value="350">$300-400/mo</option>
                                            <option value="450">$400+</option>
                                        </Field>
                                        {props.errors.averageBill && props.touched.averageBill ? (
                                            <span className="red">{props.errors.averageBill}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <label>Is the building shaded?</label>
                                        <br/>
                                        <Field
                                            component={RadioButton}
                                            name="shaded"
                                            id="true"
                                            label="Yes"
                                        />
                                        <Field
                                            component={RadioButton}
                                            name="shaded"
                                            id="false"
                                            label="No"
                                        />
                                        {props.errors.shaded && props.touched.shaded ? (
                                            <span className="red">{props.errors.shaded}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row className="s-margin-b">
                                    <Col xs={12} sm={6}>
                                        <label>How would you like to have your proposal presented when it is ready?</label>
                                        <br/>
                                        <Field 
                                            component="select" 
                                            name="proposalPref" 
                                            value={props.values.proposalPref}
                                            onChange={props.handleChange}
                                            >
                                            <option defaultValue value="">Not selected</option> 
                                            <option value={constant.PDF}>PDF viewable via email &amp; on this site</option>
                                            <option value={constant.PHONE}>Phone call with Prestige Power sales</option>
                                            <option value={constant.INPERSON}>In person meeting (socially distanced!)</option>
                                        </Field>
                                        {props.errors.proposalPref && props.touched.proposalPref ? (
                                            <span className="red">{props.errors.proposalPref}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className={this.props.user ? "hide" : ""}>
                                        <label>What are your reasons for going solar?</label>
                                        <br/>
                                        <Checkbox name="solarReasons" label="Savings" value="savings" />
                                        <Checkbox name="solarReasons" label="Tax credit" value="tax-credit" />
                                        <Checkbox name="solarReasons" label="Environment" value="environment" />
                                        <Checkbox name="solarReasons" label="Other" value="other" />
                                    </Col>
                                </Row>
                                <Row className="s-margin-b">
                                    <Col xs={12} sm={6}>
                                        <label className="no-margin">Upload your power bill:</label>
                                        <div className="grey s-text">This will expedite the qualification process.</div>
                                        {!this.state.fileUrl && (
                                            <input type="file" onChange={this.handleFileChange} />
                                        )}
                                        <br/>
                                        {this.state.fileProgress > 0 && ( 
                                            <div className="box-text-v-align">
                                                <progress value={this.state.fileProgress} max="100"/> <b className="s-padding-l">{this.state.fileProgress}%</b>
                                            </div>
                                        )}
                                        {this.state.filePath && !this.state.fileUrl && (
                                            <button type="button" onClick={() => this.handleFileUpload(this.state.filePath)}>
                                                Upload bill
                                            </button>
                                        )}
                                        {this.state.fileUrl && (
                                            <div>
                                                <b className="green">Upload success!</b>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                                <Row className={this.props.user ? "hide" : "s-margin-b"}>
                                    <Col xs={12} className={this.state.passwordShown ? "hide" : ""}>
                                        <button className="just-text-btn text-hover green m-text" onClick={(e) => this.showPassword(e)}><i className="fas fa-key" />&nbsp; <u>Keep track of the process by creating an account!</u></button>
                                    </Col>
                                    <Col xs={12} sm={6} className={this.state.passwordShown ? "" : "hide"}>
                                        <label>Password</label>
                                        <br/>
                                        <Field
                                            type="password"
                                            onChange={props.handleChange}
                                            placeholder="******************"
                                            name="password"
                                            value={props.values.password}
                                        />
                                        {props.errors.password && props.touched.password ? (
                                            <span className="red">{props.errors.password}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className={this.state.passwordShown ? "" : "hide"}>
                                        <label>Confirm Password</label>
                                        <br/>
                                        <Field
                                            type="password"
                                            onChange={props.handleChange}
                                            placeholder="******************"
                                            name="confirmPassword"
                                            value={props.values.confirmPassword}
                                        />
                                        {props.errors.confirmPassword && props.touched.confirmPassword ? (
                                            <span className="red">{props.errors.confirmPassword}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                
                                <Row center="xs" className="s-margin-t-b">
                                    <Col xs={12}>
                                        <a className="btn btn-md animated-button victoria-one" href="# " onClick={(e) => props.handleSubmit(e)}>
                                            <button type="submit" className="just-text-btn" disabled={!props.dirty && !props.isSubmitting}>Submit</button>
                                        </a>
                                    </Col>
                                </Row>
                                <Row center="xs" className={this.props.user ? "hide" : "s-margin-t-b"}>
                                    <Col xs={12}>
                                        <Link to="/login" className="grey-text-btn s-padding-b">
                                            Already have an account?
                                        </Link>
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                    <div id="recaptcha" className="p-container recaptcha"></div>
                                    </Col>
                                </Row>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

// TODO: import these from utils folder file
function Checkbox(props) {
    return (
      <Field name={props.name}>
        {({ field, form }) => (
          <label className="checkbox-container">
            <input
              type="checkbox"
              {...props}
              checked={field.value.includes(props.value)}
              onChange={() => {
                if (field.value.includes(props.value)) {
                  const nextValue = field.value.filter(
                    value => value !== props.value
                  );
                  form.setFieldValue(props.name, nextValue);
                } else {
                  const nextValue = field.value.concat(props.value);
                  form.setFieldValue(props.name, nextValue);
                }
              }}
            />
            {props.label}
            <span className="checkmark"></span>
          </label>
        )}
      </Field>
    );
  }

// TODO: if there are two radio button sets, with the same id's (i.e. yes and no fields like we had with Commercial Inquiry and Building Shaded), the input toggling breaks
  const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    onSelect,
    ...props
  }) => {
    return (
      <label htmlFor={id} className="radio-container">
        {label}
        <input
          name={name}
          id={id}
          type="radio"
          value={id}
          checked={id === value}
          onChange={onChange}
          onClick={onSelect}
          onBlur={onBlur}
          {...props}
        />
        <span className="radio"></span>
      </label>
    );
  };

  export default withRouter(SolarQuoteForm);