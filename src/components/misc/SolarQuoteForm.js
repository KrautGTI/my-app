import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Field } from 'formik';

import { referralFormSchema } from '../../utils/formSchemas'
import { firestore } from "../../Fire.js";
import { validatePhone } from '../../utils/misc';

export default class SolarQuoteForm extends Component {
    constructor(props) {
        super(props);
        this.addQuoteRequest = this.addQuoteRequest.bind(this);
        this.showPassword = this.showPassword.bind(this);

        this.state = {
            passwordShown: false
        }
    }
    

    addQuoteRequest(values){
        firestore.collection('referrals').add({
            
            relation: values.relation,
            salesRep: values.salesRep,
            timestamp: Date.now(),
        }).then(
            alert("Referral submitted successfully!")
        );
      }

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
            zip: "",
            averageBill: "",
            shaded: "",
            solarReasons: "",
            business: "",
            electricityBillUrl: ""
          };

        return (
            <div className="horiz-center">
                <Formik
                    initialValues={initialFormState}
                    onSubmit={(values, actions) => {
                        this.addQuoteRequest(values);
                        actions.resetForm()
                    }}
                    validationSchema={referralFormSchema}
                    >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid fluid>
                                <Row>
                                    <Col sm={12} md={6} className="s-margin-b">
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
                                        <br/>
                                        {props.errors.firstName && props.touched.firstName ? (
                                            <span className="red">{props.errors.firstName}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col sm={12} md={6} className="s-margin-b">
                                        <label>Last name: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Doe"
                                            name="refereeLastName"
                                            value={props.values.refereeLastName}
                                        />
                                        <br/>
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
                                            validate={validatePhone}
                                            onChange={props.handleChange}
                                            value={props.values.refereePhone}
                                            type="text"
                                            placeholder={props.values.refereePhone || `(123) 456-7890`}
                                        />
                                        <br/>
                                        {props.errors.refereePhone && props.touched.refereePhone ? (
                                            <span className="red">{props.errors.refereePhone}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col sm={12} md={6} className="s-margin-b">
                                        <label>Email: <span className="red">*</span></label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="john_doe@gmail.com"
                                            name="refereeEmail"
                                            value={props.values.refereeEmail}
                                        />
                                        <br/>
                                        {props.errors.refereeEmail && props.touched.refereeEmail ? (
                                            <span className="red">{props.errors.refereeEmail}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>Zip Code:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="123456"
                                            name="zip"
                                            value={props.values.zip}
                                        />
                                        <br/>
                                        {props.errors.zip && props.touched.zip ? (
                                            <span className="red">{props.errors.zip}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>Business/Organization:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Big Business Boys LLC"
                                            name="business"
                                            value={props.values.business}
                                        />
                                        <br/>
                                        {props.errors.business && props.touched.business ? (
                                            <span className="red">{props.errors.business}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>What's your average power bill?</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="123456"
                                            name="zip"
                                            value={props.values.zip}
                                        />
                                        <br/>
                                        {props.errors.zip && props.touched.zip ? (
                                            <span className="red">{props.errors.zip}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>Is your house shaded?</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="123456"
                                            name="zip"
                                            value={props.values.zip}
                                        />
                                        <br/>
                                        {props.errors.zip && props.touched.zip ? (
                                            <span className="red">{props.errors.zip}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label>What are your reasons for going solar?</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Big Business Boys LLC"
                                            name="business"
                                            value={props.values.business}
                                        />
                                        <br/>
                                        {props.errors.business && props.touched.business ? (
                                            <span className="red">{props.errors.business}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6} className="s-margin-b">
                                        <label className="no-margin">Upload your power bill:</label>
                                        <div className="grey s-text">This will expedite the qualification process.</div>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="https://www.com"
                                            name="business"
                                            value={props.values.business}
                                        />
                                        <br/>
                                        {props.errors.business && props.touched.business ? (
                                            <span className="red">{props.errors.business}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className={this.state.passwordShown ? "hide" : "s-margin-b"}>
                                        <button className="just-text-btn text-hover green m-text" onClick={(e) => this.showPassword(e)}><i className="fas fa-key" />&nbsp; <u>Keep track of the process by creating an account!</u></button>
                                    </Col>
                                    <Col xs={12} sm={6} className={this.state.passwordShown ? "s-margin-b" : "hide"}>
                                        <label>Password</label>
                                        <br/>
                                        <Field
                                            type="password"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="******************"
                                            name="password"
                                            value={props.values.password}
                                        />
                                        <br/>
                                        {props.errors.password && props.touched.password ? (
                                            <span className="red">{props.errors.password}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className={this.state.passwordShown ? "s-margin-b" : "hide"}>
                                        <label>Confirm Password</label>
                                        <br/>
                                        <Field
                                            type="password"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="******************"
                                            name="confirmPassword"
                                            value={props.values.confirmPassword}
                                        />
                                        <br/>
                                        {props.errors.confirmPassword && props.touched.confirmPassword ? (
                                            <span className="red">{props.errors.confirmPassword}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                
                                <Row className="m-margin-b" center="xs">
                                    <Col xs={12}>
                                        <a className="btn btn-sm animated-button victoria-one" href="# ">
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
