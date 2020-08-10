import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Field } from 'formik';

import { contactFormSchema } from '../../utils/formSchemas'
import { firestore } from "../../Fire.js";
import { withAlert  } from 'react-alert'

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);
    }
    
    addMessage(values){
        firestore.collection('messages').add({
            email: values.email,
            name: values.name,
            message: values.message,
            timestamp: Date.now(),
        }).then(
            this.props.alert.success('Message submitted successfully.')
        );
      }
      
    render() {
        const initialFormState = {
            email: "",
            name: "",
            message: ""
          };

        return (
            <div className="horiz-center">
                <button onClick={() => this.props.alert.success(<div style={{ backgroundColor: '#032632', }}>Message submitted successfully.</div>)}>CLICK</button>
                <Formik
                    initialValues={initialFormState}
                    onSubmit={(values, actions) => {
                        this.addMessage(values);
                        actions.resetForm()
                    }}
                    validationSchema={contactFormSchema}
                    >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid fluid>
                                <Row>
                                    <Col sm={12} md={6} className="s-margin-b">
                                        <label>Name:</label>
                                        <br/>
                                        <Field
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="John Doe"
                                            name="name"
                                            value={props.values.name}
                                        />
                                        {props.errors.name && props.touched.name ? (
                                            <span className="red">{props.errors.name}</span>
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
                                <Row>
                                    <Col xs={12} className="s-margin-b">
                                        <label>Message:</label>
                                        <br/>
                                        <Field
                                            component="textarea"
                                            required
                                            onChange={props.handleChange}
                                            placeholder="Detail what you want to say here."
                                            name="message"
                                            value={props.values.message}
                                        />
                                        {props.errors.message && props.touched.message ? (
                                            <span className="red">{props.errors.message}</span>
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

export default withAlert()(ContactForm)
