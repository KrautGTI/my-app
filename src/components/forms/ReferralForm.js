import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Field } from 'formik';
import { store } from 'react-notifications-component';
import { referralFormSchema } from '../../utils/formSchemas'
import { firestore } from "../../Fire.js";
import { validatePhone, timestampToDateTime } from '../../utils/misc';
import * as constant from "../../utils/constants.js";

class ReferralForm extends Component {
    constructor(props) {
        super(props);
        this.addReferral = this.addReferral.bind(this);
        
        this.state = {
            user: {}
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

    addReferral(values, resetForm){
        if(this.props.user){
            firestore.collection('referrals').add({
                referee: {
                    firstName: values.refereeFirstName,
                    lastName: values.refereeLastName,
                    phone: values.refereePhone,
                    email: values.refereeEmail
                },
                referrer: {
                    firstName: this.state.user.firstName,
                    lastName: this.state.user.lastName,
                    phone: this.state.user.phone,
                    email: this.state.user.email,
                    userId: this.props.user.uid
                },
                relation: values.relation,
                salesRep: values.salesRep,
                timestamp: Date.now(),
                status: constant.PENDING
            }).then(() => {
                resetForm()
                store.addNotification({
                    title: "Success",
                    message: "Referral submitted successfully.",
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
            });
        } else {
            firestore.collection('referrals').add({
                referee: {
                    firstName: values.refereeFirstName,
                    lastName: values.refereeLastName,
                    phone: values.refereePhone,
                    email: values.refereeEmail
                },
                referrer: {
                    firstName: values.referrerFirstName,
                    lastName: values.referrerLastName,
                    phone: values.referrerPhone,
                    email: values.referrerEmail,
                    userId: ""
                },
                relation: values.relation,
                salesRep: values.salesRep,
                timestamp: Date.now(),
                status: constant.PENDING
            }).then(() => {
                resetForm()
                store.addNotification({
                    title: "Success",
                    message: "Referral submitted successfully.",
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
            });
        }
      }
      
    render() {
        const initialFormState = {
            refereeFirstName: "",
            refereeLastName: "",
            refereePhone: "",
            refereeEmail: "",
            relation: "",
            referrerFirstName: "",
            referrerLastName: "",
            referrerPhone: "",
            referrerEmail: "",
            salesRep: ""
          };

        return (
            <div className="horiz-center">
                <Formik
                    initialValues={initialFormState}
                    onSubmit={(values, actions) => {
                        this.addReferral(values, actions.resetForm);
                    }}
                    validationSchema={referralFormSchema}
                    >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid fluid>
                                <h2>Their Information</h2>
                                <Row>
                                    <Col sm={12} md={6} className="s-margin-b">
                                        <label>First name: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            autoComplete="none"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="John"
                                            name="refereeFirstName"
                                            value={props.values.refereeFirstName}
                                        />
                                        {props.errors.refereeFirstName && props.touched.refereeFirstName ? (
                                            <span className="red">{props.errors.refereeFirstName}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col sm={12} md={6} className="s-margin-b">
                                        <label>Last name: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            autoComplete="none"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Doe"
                                            name="refereeLastName"
                                            value={props.values.refereeLastName}
                                        />
                                        {props.errors.refereeLastName && props.touched.refereeLastName ? (
                                            <span className="red">{props.errors.refereeLastName}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} md={6}>
                                        <label>Phone: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            name="refereePhone"
                                            autoComplete="none"
                                            validate={validatePhone}
                                            onChange={props.handleChange}
                                            value={props.values.refereePhone}
                                            type="text"
                                            placeholder={props.values.refereePhone || `(123) 456-7890`}
                                        />
                                        {props.errors.refereePhone && props.touched.refereePhone ? (
                                            <span className="red">{props.errors.refereePhone}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col sm={12} md={6} className="s-margin-b">
                                        <label>Email:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            autoComplete="none"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="john_doe@gmail.com"
                                            name="refereeEmail"
                                            value={props.values.refereeEmail}
                                        />
                                        {props.errors.refereeEmail && props.touched.refereeEmail ? (
                                            <span className="red">{props.errors.refereeEmail}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>
                                            How do you know&nbsp;
                                            {props.values.refereeFirstName 
                                                ? 
                                                <span className="dark-green">{props.values.refereeFirstName} {props.values.refereeLastName}</span> 
                                                : 
                                                <span style={{borderBottom: "1px solid black", paddingLeft: "50px"}}>&nbsp;</span>
                                            }
                                            ?:
                                        </label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder={props.values.refereeFirstName 
                                                ? 
                                                `${props.values.refereeFirstName} is my neighbor!`
                                                : 
                                                `Jane is my neighbor!`
                                            }
                                            name="relation"
                                            value={props.values.relation}
                                        />
                                        {props.errors.relation && props.touched.relation ? (
                                            <span className="red">{props.errors.relation}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <hr/>
                                <div className={this.props.user ? "hide" : ""}>
                                    <h2>Your Information</h2>
                                    <Row>
                                        <Col sm={12} md={6} className="s-margin-b">
                                            <label>First name:</label>
                                            <br/>
                                            <Field
                                                type="text"
                                                required
                                                onChange={props.handleChange}
                                                placeholder="John"
                                                name="referrerFirstName"
                                                value={props.values.referrerFirstName}
                                            />
                                            {props.errors.referrerFirstName && props.touched.referrerFirstName ? (
                                                <span className="red">{props.errors.referrerFirstName}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                        <Col sm={12} md={6} className="s-margin-b">
                                            <label>Last name:</label>
                                            <br/>
                                            <Field
                                                type="text"
                                                required
                                                onChange={props.handleChange}
                                                placeholder="Doe"
                                                name="referrerLastName"
                                                value={props.values.referrerLastName}
                                            />
                                            {props.errors.referrerLastName && props.touched.referrerLastName ? (
                                                <span className="red">{props.errors.referrerLastName}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <label>Phone: </label>
                                            <br/>
                                            <Field
                                                name="referrerPhone"
                                                validate={validatePhone}
                                                onChange={props.handleChange}
                                                value={props.values.referrerPhone}
                                                type="text"
                                                placeholder={props.values.referrerPhone || `(123) 456-7890`}
                                            />
                                            {props.errors.referrerPhone && props.touched.referrerPhone ? (
                                                <span className="red">{props.errors.referrerPhone}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                        <Col sm={12} md={6} className="s-margin-b">
                                            <label>Email:</label>
                                            <br/>
                                            <Field
                                                type="text"
                                                required
                                                onChange={props.handleChange}
                                                placeholder="john_doe@gmail.com"
                                                name="referrerEmail"
                                                value={props.values.referrerEmail}
                                            />
                                            {props.errors.referrerEmail && props.touched.referrerEmail ? (
                                                <span className="red">{props.errors.referrerEmail}</span>
                                            ) : (
                                                ""
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                                
                                <Row>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>Who was your sales representative?:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Bob James"
                                            name="salesRep"
                                            value={props.values.salesRep}
                                        />
                                        {props.errors.salesRep && props.touched.salesRep ? (
                                            <span className="red">{props.errors.salesRep}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row center="xs" className="s-margin-t-b">
                                    <Col xs={12}>
                                        <a className="btn btn-sm animated-button victoria-one" href="# " onClick={(e) => props.handleSubmit(e)}>
                                            <button type="submit" className="just-text-btn" disabled={!props.dirty && !props.isSubmitting}>Submit</button>
                                        </a>
                                    </Col>
                                </Row>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default ReferralForm