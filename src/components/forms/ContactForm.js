import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Field } from 'formik';
import { store } from 'react-notifications-component';
import { contactFormSchema, userContactFormSchema } from '../../utils/formSchemas'
import { firestore } from "../../Fire.js";
import * as constant from "../../utils/constants.js";

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);

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
    
    addMessage(values){
        if(this.props.user){
            firestore.collection('messages').add({
                email: this.state.user.email,
                name: `${this.state.user.firstName} ${this.state.user.lastName}`,
                message: values.message,
                userId: this.props.user.uid,
                timestamp: Date.now(),
                status: constant.PENDING
            }).then(
                store.addNotification({
                    title: "Success",
                    message: "Message submitted successfully.",
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
            );
        } else {
            firestore.collection('messages').add({
                email: values.email,
                name: values.name,
                message: values.message,
                userId: "",
                timestamp: Date.now(),
                status: constant.PENDING
            }).then(
                store.addNotification({
                    title: "Success",
                    message: "Message submitted successfully.",
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
            );
        }
        
      }
      
    render() {
        const initialFormState = {
            email: "",
            name: "",
            message: ""
          };

        return (
            <div className="horiz-center">
                <Formik
                    initialValues={initialFormState}
                    onSubmit={(values, actions) => {
                        this.addMessage(values);
                        actions.resetForm()
                    }}
                    validationSchema={this.props.user ? userContactFormSchema : contactFormSchema}
                    >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid fluid>
                                <Row className={this.props.user ? "hide" : ""}>
                                    <Col xs={12} sm={6} className="s-margin-b">
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
                                    <Col xs={12} sm={6} className="s-margin-b">
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

export default ContactForm
