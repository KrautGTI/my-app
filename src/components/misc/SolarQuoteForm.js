import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Form, Field } from 'formik';

import { solarQuoteFormSchema } from '../../utils/formSchemas'
import { firestore, storage } from "../../Fire.js";
import { validatePhone } from '../../utils/misc';

export default class SolarQuoteForm extends Component {
    constructor(props) {
        super(props);
        this.addQuoteRequest = this.addQuoteRequest.bind(this);
        this.showPassword = this.showPassword.bind(this);

        this.state = {
            passwordShown: false,
            filePath: null,
            fileUrl: "",
            fileProgress: 0
        }
    }
    
    addQuoteRequest(values, resetForm){
        console.log("Values: ")
        console.log(values)
        console.log("Bill URL: ")
        console.log(this.state.fileUrl)
        // if(values.password)
        // firestore.collection('referrals').add({
            
        //     relation: values.relation,
        //     salesRep: values.salesRep,
        //     timestamp: Date.now(),
        // }).then(
        //     alert("Referral submitted successfully!")
        // );
        alert("Submitted.")
        resetForm()
    }

    handleFileChange = e => {
        if (e.target.files[0]) {
          const filePath = e.target.files[0];
          this.setState(() => ({ filePath }));
        }
      };

    handleFileUpload = (file) => {
        // TODO: randomize file name
        const uploadTask = storage.ref(`bills/${file.name}`).put(file);
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
              .ref("bills")
              .child(file.name)
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
            zip: "",
            averageBill: "",
            shaded: "",
            solarReasons: [],
            business: "",
            billUrl: "",
            password: "",
            confirmPassword: ""
          };

        return (
            <div className="horiz-center">
                <Formik
                    initialValues={initialFormState}
                    onSubmit={(values, actions) => {
                        this.addQuoteRequest(values, actions.resetForm)
                    }}
                    validationSchema={solarQuoteFormSchema}
                    >
                    {props => (
                        <Form>
                            <Grid fluid>
                                <Row className="s-margin-b">
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
                                <Row className="s-margin-b">
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
                                <Row className="s-margin-b">
                                    <Col xs={12} sm={6}>
                                        <label>ZIP Code:</label>
                                        <br/>
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
                                    <Col xs={12} sm={6}>
                                        <label>Business/Organization:</label>
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
                                <Row className="s-margin-b">
                                    <Col xs={12} sm={6}>
                                        <label>What's your average power bill?</label>
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
                                        <label>Is your house shaded?</label>
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
                                <Row className="s-margin-b">
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
                                <Row className="m-margin-b">
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