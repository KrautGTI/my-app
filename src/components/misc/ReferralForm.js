import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Field } from 'formik';

import { referralFormSchema } from '../../utils/formSchemas'
import { firestore } from "../../Fire.js";
import { validatePhone } from '../../utils/misc';

export default class ReferralForm extends Component {
    constructor(props) {
        super(props);
        this.addReferral = this.addReferral.bind(this);
    }
    

    addReferral(values){
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
                email: values.referrerEmail
            },
            relation: values.relation,
            salesRep: values.salesRep,
            timestamp: Date.now(),
        }).then(
            alert("Referral submitted successfully!")
        );
      }
      
    render() {
        // TODO: if signed in, auto fill based on current logged in user data! probably have to turn on formik revalid
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
                        this.addReferral(values);
                        actions.resetForm()
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
                                            required
                                            onChange={props.handleChange}
                                            placeholder="John"
                                            name="refereeFirstName"
                                            value={props.values.refereeFirstName}
                                        />
                                        <br/>
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
                                        <label>Email:</label>
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
                                    <Col xs={12} className="s-margin-b">
                                        <label>How do you know each other?:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Jane is my neighbor!"
                                            name="relation"
                                            value={props.values.relation}
                                        />
                                        <br/>
                                        {props.errors.relation && props.touched.relation ? (
                                            <span className="red">{props.errors.relation}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <hr/>
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
                                        <br/>
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
                                        <br/>
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
                                        <br/>
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
                                        <br/>
                                        {props.errors.referrerEmail && props.touched.referrerEmail ? (
                                            <span className="red">{props.errors.referrerEmail}</span>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className="s-margin-b">
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
                                        <br/>
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
