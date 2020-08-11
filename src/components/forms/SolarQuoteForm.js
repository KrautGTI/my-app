import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Form, Field } from 'formik';
import { withRouter, Link } from "react-router-dom";
import { withAlert  } from 'react-alert'

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
            this.props.alert.error("A file was selected, but never uploaded. Tap the 'Upload bill' button before submitting or delete the file selection to continue.")
        } else {
            // Case: User either didn't select a file or selected a file properly
            if(this.state.passwordShown && (!values.password || !values.confirmPassword)){
                // Case: User may have intended to insert password for account, but didn't fill one of the password fields
                // TODO: change to our confirm
                const confirmPasswordResponse = window.confirm("The password field was opened, but not finished. Did you want to continue anyways?");
                if(confirmPasswordResponse){
                    // Case: User doesn't care that the password wasn't inputted, creating client and building without account
                    firestore.collection('users').add({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phone: values.phone,
                        email: values.email,
                        business: values.business,
                        solarReasons: values.solarReasons,
                        assignedTo: '',
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
                                shaded: values.shaded,
                                billUrl: this.state.fileUrl,
                                timestamp: Date.now(),
                            })
                        }
                        
                        this.setState({
                            fileUrl: "",
                            filePath: "",
                            fileProgress: 0
                        });
                        resetForm();
                        this.props.alert.success("Submitted building proposal!")
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
                    solarReasons: values.solarReasons,
                    assignedTo: '',
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
                            shaded: values.shaded,
                            billUrl: this.state.fileUrl,
                            timestamp: Date.now(),
                        })
                    }
                    this.setState({
                        fileUrl: "",
                        filePath: "",
                        fileProgress: 0
                    });
                    resetForm();
                    this.props.alert.success("Submitted building proposal!")
                });
            } else if(this.state.passwordShown && values.password && values.confirmPassword) {
                // Case: User is creating an account!
                if(values.password === values.confirmPassword){
                    this.props.alert.info("Please fill out the recaptcha challenge before continuing!")
                    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
                        'callback': (response) => {
                          // reCAPTCHA solved, allow Ask.
                          fire.auth().createUserWithEmailAndPassword(values.email, values.password)
                            .then((userData) => {
                                // No existing user, now add to Firestore
                                var currentUser = fire.auth().currentUser;
                                currentUser.updateProfile({
                                  displayName: (values.firstName + " " + values.lastName)
                                }).then(function() {
                                  console.log("Successfully added display name to Firebase.");
                                }).catch(function(error) {
                                  console.error("Error adding your display name to database: ", error);
                                  this.props.alert.error("Error adding your display name to database: " + error)
                                  window.recaptchaVerifier.clear()
                                });
                                
                                if(values.zip || values.averageBill || values.shaded || this.state.fileUrl){
                                    // Case: User inputted at least one of the building fields
                                    firestore.collection('buildings').add({
                                        clientId: userData.user.uid,
                                        buildingName: values.buildingName,
                                        status: constant.PENDING,
                                        zip: values.zip,
                                        averageBill: values.averageBill,
                                        shaded: values.shaded,
                                        billUrl: this.state.fileUrl,
                                        timestamp: Date.now(),
                                    })
                                }
                                
                                firestore.collection("users").doc(userData.user.uid).set({
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    phone: values.phone,
                                    email: values.email,
                                    business: values.business,
                                    solarReasons: values.solarReasons,
                                    assignedTo: '',
                                    timestamp: Date.now(),
                                }, { merge: true }).then(() => {
                                    console.log("Successful write to Firestore.");
                                    this.props.history.push("/account");
                                }).catch((error) => {
                                    console.error("Error adding document: ", error);
                                    this.props.alert.error("Error adding document: " + error)
                                    window.recaptchaVerifier.clear()
                                });
                            }).catch((error) => {
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log("Error registering: " + errorCode + ": " + errorMessage)
                                this.props.alert.error("Error registering: " + error)
                                window.recaptchaVerifier.clear()
                              });
                            //   TODO: if register email is taken,needs to throw error on what to do!
                        },
                        'expired-callback': () => {
                          // Response expired. Ask user to solve reCAPTCHA again.
                          this.props.alert.error("Please solve the reCAPTCHA again.")
                          window.recaptchaVerifier.clear()
                        }
                      })
                      window.recaptchaVerifier.render()
                } else {
                    this.props.alert.error("Passwords you entered do not match! Try again.")
                }
            } else {
                this.props.alert.error("Unknown case, please check fields and try again!")
            }
        }
    }

    addUserQuote = (values, resetForm) => {
        if(this.state.filePath && !this.state.fileUrl){
            // Case: User selected file, but didn't upload before submit
            this.props.alert.error("A file was selected, but never uploaded. Tap the 'Upload bill' button before submitting or delete the file selection to continue.")
        } else {
            if(!values.zip){
                // TODO: discuss with reed
                this.props.alert.error("You must enter at least the ZIP code for us to help the property.")
            } else {
                // Case: User inputted at least one of the building fields
                firestore.collection('buildings').add({
                    clientId: this.props.user.uid,
                    status: constant.PENDING,
                    zip: values.zip,
                    buildingName: values.buildingName,
                    averageBill: values.averageBill,
                    shaded: values.shaded,
                    billUrl: this.state.fileUrl,
                    timestamp: Date.now(),
                }).then(() => {
                    this.setState({
                        fileUrl: "",
                        filePath: "",
                        fileProgress: 0
                    });
                    resetForm();
                    this.props.alert.success("Submitted building proposal!")
                }).catch((error) => {
                    this.props.alert.error("Error adding building: " + error)
                })
            }
           
                
            
        }
    }

    // TODO: allow user to delete file selection

    handleFileChange = e => {
        if (e.target.files[0]) {
          const filePath = e.target.files[0];
          this.setState(() => ({ filePath }));
        }
      };

    handleFileUpload = (file) => {
        const randomId = genId(5)
        // TODO: set max file size allowed
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
        // TODO: if signed in, auto fill based on current logged in user data! probably have to turn on formik revalid
        const initialFormState = {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            buildingName: "",
            zip: "",
            averageBill: "",
            shaded: "",
            solarReasons: [],
            business: "",
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
                                    <Col xs={12} sm={6}>
                                        <label>Business/Organization:</label>
                                        {/* TODO: If user fills this in, perhaps just ask if they are looking for a commercial quote? */}
                                        <br/>
                                        <Field
                                            type="text"
                                            onChange={props.handleChange}
                                            placeholder="Big Business Boys LLC"
                                            name="business"
                                            value={props.values.business}
                                        />
                                        {props.errors.business && props.touched.business ? (
                                            <span className="red">{props.errors.business}</span>
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
                                            id="yes"
                                            label="Yes"
                                        />
                                        <Field
                                            component={RadioButton}
                                            name="shaded"
                                            id="no"
                                            label="No"
                                        />
                                        {props.errors.shaded && props.touched.shaded ? (
                                            <span className="red">{props.errors.shaded}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row className={this.props.user ? "hide" : "s-margin-b"}>
                                    <Col xs={12} sm={6}>
                                        <label>What are your reasons for going solar?</label>
                                        <br/>
                                        <Checkbox name="solarReasons" label="Savings" value="savings" />
                                        <Checkbox name="solarReasons" label="Tax credit" value="tax-credit" />
                                        <Checkbox name="solarReasons" label="Environment" value="environment" />
                                        <Checkbox name="solarReasons" label="Other" value="other" />
                                        {/* TODO: isnt savings and tax credit the same thing? */}
                                        {/* TODO: Custom field for other to enter something? */}
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

  export default withAlert()(withRouter(SolarQuoteForm));