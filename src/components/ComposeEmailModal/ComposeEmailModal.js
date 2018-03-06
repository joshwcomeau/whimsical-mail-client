// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

type Props = {
  isOpen: boolean,
  handleClose: () => void,
};

class ComposeEmailModal extends Component<Props> {
  static defaultProps = {
    isOpen: false,
  };

  render() {
    const { isOpen, handleClose } = this.props;

    return (
      <Wrapper isOpen={isOpen}>
        <Backdrop onClick={handleClose} />
        <Modal>Hello World</Modal>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
`;

const Modal = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 500px;
  height: 500px;
  background: white;
  box-shadow: 0px 5px 60px rgba(0, 0, 0, 0.4);
`;

export default ComposeEmailModal;
