import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-modal';
import { confirmable, createConfirmation } from 'react-confirm';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.state = {
      showModal: !!this.props.show,
    };
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {
      proceedLabel,
      cancelLabel,
      title,
      confirmation,
      proceed,
      dismiss,
      cancel
    } = this.props;
    return (
      <Modal
        isOpen={this.state.showModal}
        className="l-container background-blue p-top-center center-text"
        contentLabel="Confirmation"
        onRequestClose={() => {
          this.handleCloseModal();
          dismiss();
        }}
      >
          <div className="white">
            <h4>
              {title}
              <i
                onClick={() => {
                  this.handleCloseModal();
                  dismiss();
                }}
                className="fas fa-times right text-hover-red"
              />
            </h4>
            
          </div>
          <div>
            <span className="white">{confirmation}</span>
            <br />
            <br />
            <button className="s-btn" onClick={proceed}>
              {proceedLabel}
            </button>
            &nbsp;
            <button
              className="s-btn-red"
              onClick={() => {
                this.handleCloseModal();
                cancel();
              }}
            >
              {cancelLabel}
            </button>
          </div>
        
      </Modal>
    );
  }
}

Confirmation.propTypes = {
  okLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
  cancel: PropTypes.func, // called when cancel button is clicked.
  dismiss: PropTypes.func, // called when backdrop is clicked or escaped.
  enableEscape: PropTypes.bool
};

export function confirm(
  confirmation,
  title = 'Alert',
  proceedLabel = 'OK',
  cancelLabel = 'cancel'
) {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    title,
    proceedLabel,
    cancelLabel
  });
}
