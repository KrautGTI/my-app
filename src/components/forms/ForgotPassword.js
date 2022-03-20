import React from "react";
import Modal from "react-modal";
import { Formik, Field } from 'formik';
import { forgotPasswordSchema } from "../../utils/formSchemas"

const initialFormState = {
  email: ""
};

export const ForgotPassword = React.memo(function(props) {
  return (
    <div>
      <button 
        className={props.linkClass} 
        type="button"
        onClick={props.handleOpenModal}>
        {props.wording}
      </button>
      <Modal
        isOpen={props.showModal}
        className="l-container background-blue p-top-center center-text"
        contentLabel="Forgot Password"
        onRequestClose={() => props.handleCloseModal()}
      >
          <div className="white">
            <h4>
              Forgot Password
              <i
                onClick={() => props.handleCloseModal()}
                className="fas fa-times right text-hover-red"
              />
            </h4>
            
          </div>
          <div>
            <p className="white">
                Please enter your address email below and we will send that email a password reset link. When you click that link in your email, you will be able to create a new password.
                <br/>
                If this doesn't work within 10 or so minutes, contact us at <u>help@minute.tech</u>.
            </p>
            <br />
            <Formik
                initialValues={initialFormState}
                validationSchema={forgotPasswordSchema}
                onSubmit={(values, actions) => {
                    props.sendPasswordReset(values);
                    actions.resetForm();
                }}
                >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <label htmlFor="email" className="white">Email on file: </label>
                        <Field
                            type="email"
                            className="m-width center"
                            onChange={props.handleChange}
                            name="email"
                            value={props.values.email}
                            placeholder="forgot-email@email.com"
                        />
                        {props.errors.email && props.touched.email ? (
                            <span className="yup-error">{props.errors.email}</span>
                        ) : (
                            ""
                        )}
                        <br/>
                        <button
                            type="submit"
                            className="s-btn"
                            disabled={!props.dirty || props.isSubmitting}
                        >
                            Send reset link to email
                        </button>
                    </form>
                )}
            </Formik>
          </div>
        
      </Modal>
      
    </div>
  );
});
