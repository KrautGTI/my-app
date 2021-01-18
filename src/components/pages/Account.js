import React, { Component } from 'react'
import { Formik, Form, Field } from "formik";
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { store } from 'react-notifications-component';
import { Helmet } from 'react-helmet-async';

import { fire, firestore } from "../../Fire.js";
import { confirm } from "../misc/Confirmation";
import { ucFirst, validatePhone, timestampToDateTime } from "../../utils/misc";
import { profileSchema } from "../../utils/formSchemas"
import * as constant from "../../utils/constants.js";

class Account extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            user: {},
            buildings: []
        }
    }
    
    componentDidMount(){
        if(this.props.user){
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

            this.unsubscribeBuildings = firestore.collection("buildings").where("clientId", "==", this.props.user.uid).orderBy("timestamp", "desc")
                .onSnapshot((querySnapshot) => {
                    var tempBuildings = []
                    querySnapshot.forEach((doc) => {
                        tempBuildings.push(doc.data());
                    });
                    this.setState({
                        buildings: tempBuildings
                    })
                });

        }
    }

    componentWillUnmount() {
        if(this.unsubscribeUsers){
            this.unsubscribeUsers();
        }

        if(this.unsubscribeBuildings){
            this.unsubscribeBuildings();
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
                        store.addNotification({
                            title: "Error",
                            message: `Error changing your name on database:  ${error}`,
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
                   
                }).catch((error) => {
                    if(error.code === "auth/user-token-expired"){
                        store.addNotification({
                            title: "Error",
                            message: 'Your log in status has changed. Please sign out and sign back in with your credentials.',
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
                        window.location.reload();
                    } else {
                        store.addNotification({
                            title: "Error",
                            message: `Error updating display name on Firebase: ${error}`,
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
                        console.error("Error updating display name on Firebase: " + error);
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
                store.addNotification({
                    title: "Success",
                    message: 'Successfully updated profile details.',
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
                    message: `Error changing your info on database:  ${error}`,
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
                store.addNotification({
                    title: "Success",
                    message: 'Reset link has been sent to your email.',
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
                    message: `Error sending password reset: ${error.message}`,
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
        } else {
            store.addNotification({
                title: "Error",
                message: 'Your log in status has changed. Please sign out and sign back in with your credentials.',
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
            window.location.reload();
        }
    }

    renderStatus(status, proposalUrl = ""){
        if(status === constant.PENDING){
            return(
                <>
                    <label>Status:</label>&nbsp;
                    <span className="green">Pending <i className="fas fa-spinner fa-spin"/></span> 
                    <div className="s-text s-margin-b">We are working on your solar request and will notify you via email and on this page when it is ready!</div>
                </>
            )
        } else if(status === constant.READY){
            return (
                <>
                    <label>Status:</label>&nbsp;
                    <div className="green s-margin-b">
                        <a href={proposalUrl} rel="noopener noreferrer" target="_blank" className="btn btn-sm animated-button victoria-one">
                            <button type="button" className="just-text-btn">Proposal ready to view&nbsp; <i className="fas fa-file-alt"/></button>
                        </a>
                    </div> 
                </>
            )
        } else if(status === constant.DONE){
            return (
                <>
                    <label>Status:</label>&nbsp;
                    <span className="green">Done <i className="fas fa-check"/></span> 
                    <div className="s-text s-margin-b">Your request is complete, you can <a href={proposalUrl} rel="noopener noreferrer" target="_blank">view your proposal here</a>. Thank you for choosing Prestige Power!</div>
                </>
            )
        } else if(status === constant.EXPIRED){
            return (
                <>
                    <label>Status:</label>&nbsp;
                    <span className="green">Expired <i className="fas fa-times"/></span> 
                    <div className="s-text s-margin-b">Your request has been more than 90 days ago and has expired. <Link to="/solar-quote" className="green">Please resubmit your request.</Link></div>
                </>
            )
        } else {
            return (<span>Loading... </span>)
        }
    }

    render() {
        const initialFormState = {
            firstName: this.state.user.firstName || "",
            lastName: this.state.user.lastName || "",
            email: this.state.user.email || "",
            phone: this.state.user.phone || "",
            business: this.state.user.business || ""
        };
        if(!this.state.user && !this.state.user.timestamp){
            return(<div className="wrapper"><h2>Loading your user data...</h2></div>)
        } else {
            return (
                <div className="wrapper">
                    <Helmet>
                        <title>Account | Prestige Power</title>
                    </Helmet>
                    <h1>Your Account</h1>
                    {this.state.user.isAdmin && (
                         <Link to="/admin-panel/" className="btn btn-sm animated-button doug-two s-width">
                            <button type="button" className="just-text-btn">Go to admin panel <i className="fas fa-user-shield"/></button>
                        </Link>
                    )}
                    <h2>Open Proposals</h2>
                    {
                        this.state.buildings.map((building, index) => {
                            return(
                                <div className="border-blue s-margin-t-b" key={index}>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12}>
                                                <h4>{building.buildingName || `Building ${building.zip}`}</h4>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                {this.renderStatus(building.status, building.proposalUrl)}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={4}>
                                                <div><b>Zip:</b> {building.zip}</div>
                                            </Col>
                                            <Col xs={12} sm={4}>
                                                <div><b>Uploaded Bill URL:</b> <a href={building.billUrl} target="_blank" rel="noopener noreferrer" className="green">Click to view</a></div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={4}>
                                                <div><b>Shaded?:</b> {building.shaded || "Not provided"}</div>
                                            </Col>
                                            <Col xs={12} sm={4}>
                                                <div><b>Average bill cost:</b> {building.averageBill || "Not provided"}</div>
                                            </Col>
                                            <Col xs={12} sm={4}>
                                                <b>Submitted:</b>&nbsp;
                                                <time>
                                                    {timestampToDateTime(building.timestamp).fullDate} @ {timestampToDateTime(building.timestamp).fullTime}
                                                </time>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                            )
                        })
                    }
                    {/* <Link to="/buildings" className="btn btn-sm animated-button victoria-one">
                        <button type="submit" className="just-text-btn">View open building quotes</button>
                    </Link> */}
                    <br/>
                    <hr/>
                    <h2>Personal Info</h2>
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
                                                <span className="grey s-text">*currently not changeable</span>
                                                {/* &nbsp;&nbsp;  
                                                <Link to="/account/profile/change-email">
                                                    <span className="grey s-text">edit</span>
                                                </Link>  */}
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
                                        <Col xs={12} sm={3} className="s-margin">
                                            <a className="btn btn-sm animated-button victoria-one big-width" href="# " onClick={(e) => props.handleSubmit(e)}>
                                                <button type="submit" className="just-text-btn" disabled={!props.dirty && !props.isSubmitting}>Update changes</button>
                                            </a>
                                        </Col>
                                        <Col xs={12} sm={3} className="s-margin">
                                            <a className="btn btn-sm animated-button thar-four" href="# " onClick={props.handleReset}>
                                                <button type="button" className="just-text-btn">Reset changes</button>
                                            </a>
                                        </Col>
                                        <Col xs={12} sm={3} className="s-margin">
                                            <a className="btn btn-sm animated-button thar-three" href="# " onClick={this.sendPasswordReset}>
                                                <button type="button" className="just-text-btn">Change password</button>
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row className="s-padding-t">
                                        <label>Registered: </label>&nbsp;
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

export default Account
