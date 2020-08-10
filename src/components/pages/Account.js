import React, { Component } from 'react'
import { Formik, Form, Field } from "formik";
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withAlert  } from 'react-alert'

import { fire, firestore } from "../../Fire.js";
import { confirm } from "../misc/Confirmation";
import { ucFirst, validatePhone, timestampToDateTime } from "../../utils/misc";
import { profileSchema } from "../../utils/formSchemas"

class Account extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            user: {}
        }
    }
    
    componentDidMount(){
        if(this.props.user.uid){
            // Listen for Firestore changes
            this.unsubscribeUsers = firestore.collection("users").doc(this.props.user.uid)
                .onSnapshot((doc) => {
                    var docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    docWithMore.timestamp = timestampToDateTime(doc.data().timestamp)
                    // Check for corner case where user clicks link to change email back when it is changed
                    // In this case, we just change it to the Firebase value again.
                    var currentUser = fire.auth().currentUser;
                    if(currentUser && currentUser.email && currentUser.email !== doc.data().email){
                        firestore.collection("users").doc(this.props.user.uid).set({
                            email: currentUser.email
                        }, { merge: true }).then(() => {
                            console.log("Updated email on Firestore to new value from Firebase.")
                        }).catch((error) => {
                            console.error("Error changing your email to changed value from Firebase: " + error);
                        });
                        docWithMore.email = currentUser.email;
                    } 

                    this.setState({
                        user: docWithMore
                    }) 
                });
        }
    }

    componentWillUnmount() {
        if(this.unsubscribeUsers){
            this.unsubscribeUsers();
        }
    }   

    updateDetails = (values, setSubmitting) => {
        confirm(
          "Do you really want to update your settings?",
          "Update Settings",
          "Yes",
          "No"
        ).then(
          () => {   
            // Update firebase user data first
            //TODO: what about the email?
            if(values.firstName !== this.state.user.firstName || values.lastName !== this.state.user.lastName){
                // Only update if name values have changed
                var currentUser = fire.auth().currentUser;
                currentUser.updateProfile({
                    displayName: ucFirst(values.firstName) + " " + ucFirst(values.lastName)
                }).then(() => {
                    console.log("Updated name details on Firebase.")
                    firestore.collection("users").doc(this.props.user.uid).set({
                        firstName: ucFirst(values.firstName),
                        lastName: ucFirst(values.lastName),
                    }, { merge: true }).then(() => {
                        console.log("Updated name details on Firestore.")
                    }).catch((error) => {
                        console.error("Error changing your name on database: " + error);
                        this.props.alert.error('Error changing your name on database: ' + error)
                    });
                   
                }).catch((error) => {
                    if(error.code === "auth/user-token-expired"){
                        this.props.alert.error('Your log in status has changed. Please sign out and sign back in with your credentials.')
                        window.location.reload();
                    } else {
                        console.error("Error updating display name on Firebase: " + error);
                        this.props.alert.error('Error updating display name on Firebase: ' + error)
                    }  
                });
            }

            // Update firestore
            firestore.collection("users").doc(this.props.user.uid).set({
                firstName: values.firstName,
                lastName: values.lastName,
                business: values.business,
                phone: values.phone,
            }, { merge: true }).then(() => {
                console.log("Successfully updated profile details.")
                this.props.alert.success('Successfully updated profile details.')
            }).catch((error) => {
                this.props.alert.error('Error changing your info on database: ' + error)
                console.error("Error changing your info on database: " + error);
            });
          },
          () => {
            setSubmitting(false)
            console.log("Denied by user");
          }
        );
        setSubmitting(false)
      }

    sendPasswordReset = () => {
        var currentUser = fire.auth().currentUser;
        if(currentUser){
            fire.auth().sendPasswordResetEmail(this.state.user.email).then(() => {
                this.props.alert.success('Reset link has been sent to your email.')
            }).catch((error) => {
                this.props.alert.error('Error sending password reset: ' + error.message)
            });
        } else {
            this.props.alert.error('Your log in status has changed. Please sign out and sign back in with your credentials.')
            window.location.reload();
        }
    }

    render() {
        const initialFormState = {
            firstName: this.state.user.firstName,
            lastName: this.state.user.lastName,
            email: this.state.user.email,
            phone: this.state.user.phone,
            business: this.state.user.business
        };
        if(!this.state.user.timestamp){
            return(<div className="wrapper"><h2>Loading your user data...</h2></div>)
        } else {
            return (
                <div className="wrapper">
                    <h1>Account</h1>
                    <Link to="/buildings" className="btn btn-sm animated-button victoria-one">
                        <button type="submit" className="just-text-btn">View open building quotes</button>
                    </Link>
                    <br/>
                    <hr/>
                    <br/>
                    <Formik
                        initialValues={initialFormState}
                        validationSchema={profileSchema}
                        enableReinitialize={true}
                        onSubmit={(values, actions) => {
                            // Needed to pass setSubmitting because if confirm window was exited by accident and u tried to resubmit, button was still disabled
                            this.updateDetails(values, actions.setSubmitting);
                        }}>
                        {props => (
                            <Form onSubmit={props.handleSubmit}>
                                <Grid fluid>
                                    {/* Row 1 */}
                                    <Row>
                                        <Col xs={12} md={6} lg={4}>
                                        <label htmlFor="firstName">First name: <span className="red s-text">*required</span></label>
                                        <Field
                                            name="firstName"
                                            onChange={props.handleChange}
                                            value={props.values.firstName}
                                            type="text"
                                            placeholder={props.values.firstName || `First name`}
                                        />
                                        {props.errors.firstName && props.touched.firstName ? (
                                            <span className="red">{props.errors.firstName}</span>
                                        ) : (
                                            ""
                                        )}
                                        </Col>
                                        <Col xs={12} md={6} lg={4}>
                                        <label htmlFor="lastName">Last name: <span className="red s-text">*required</span></label>
                                        <Field
                                            name="lastName"
                                            onChange={props.handleChange}
                                            value={props.values.lastName}
                                            type="text"
                                            placeholder={props.values.lastName || `Last name`}
                                        />
                                        {props.errors.lastName && props.touched.lastName ? (
                                            <span className="red">{props.errors.lastName}</span>
                                        ) : (
                                            ""
                                        )}
                                        </Col>
                                        <Col xs={12} md={6} lg={4}>
                                            <label htmlFor="email">
                                                Email:&nbsp; 
                                                <span className="red s-text">*required</span>
                                                &nbsp;&nbsp;  
                                                <Link to="/account/profile/change-email">
                                                    <span className="grey s-text">edit</span>
                                                </Link> 
                                            </label>
                                            <Field
                                                disabled
                                                name="email"
                                                onChange={props.handleChange}
                                                value={props.values.email}
                                                type="email"
                                                placeholder={props.values.email || `john.doe@mail.com`}
                                            />
                                            {props.errors.email && props.touched.email ? (
                                                <span className="red">{props.errors.email}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                    </Row>
                                    {/* Row 2 */}
                                    <Row>
                                        <Col xs={12} sm={6}>
                                            <label htmlFor="phone">Phone: </label>
                                            <Field
                                                name="phone"
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
                                        <Col xs={12} sm={6}>
                                            <label htmlFor="business">Business: </label>
                                            <Field
                                                name="business"
                                                onChange={props.handleChange}
                                                value={props.values.business}
                                                type="text"
                                                placeholder={props.values.business || `Big Business Boys LLC`}
                                            />
                                            {props.errors.business && props.touched.business ? (
                                                <span className="red">{props.errors.business}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                    </Row>
                                   
                                    {/* Row 9 */}
                                    <Row>
                                        <Col xs={12} lg={3} className="s-padding-t">
                                            <a className="btn btn-sm animated-button victoria-one big-width" href="# " onClick={(e) => props.handleSubmit(e)}>
                                                <button type="submit" className="just-text-btn" disabled={!props.dirty && !props.isSubmitting}>Submit</button>
                                            </a>
                                        </Col>
                                        <Col xs={12} lg={3} className="s-padding-t">
                                            <a className="btn btn-sm animated-button thar-four" href="# " onClick={props.handleReset}>
                                                <button type="button" className="just-text-btn">Reset form</button>
                                            </a>
                                        </Col>
                                        <Col xs={12} lg={3} className="s-padding-t">
                                            <a className="btn btn-sm animated-button thar-three" href="# " onClick={this.sendPasswordReset}>
                                                <button type="button" className="just-text-btn">Change password</button>
                                            </a>
                                        </Col>
                                    </Row>
                                    {/* TODO: send verification link? */}
                                    <Row className="s-padding-t">
                                        <label>Member since: </label>&nbsp;
                                        <time className="box-text-v-align">
                                            {this.state.user.timestamp && this.state.user.timestamp.fullDate} @ {this.state.user.timestamp && this.state.user.timestamp.fullTime}
                                        </time>
                                    </Row>
                                </Grid> 
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }
        
    }
}

export default withAlert()(Account)
