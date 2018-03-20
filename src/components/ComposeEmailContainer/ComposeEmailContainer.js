// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { Z_INDICES } from '../../constants';
import { debounce } from '../../utils';

import { ModalConsumer } from '../ModalProvider';
import { NodeConsumer } from '../NodeProvider';
import WindowDimensions from '../WindowDimensions';
import ChildTransporter from '../ChildTransporter';
import FoldableLetter from '../FoldableLetter';
import ComposeEmail from '../ComposeEmail';
import ComposeEmailEnvelope from '../ComposeEmailEnvelope';

import type { Nodes } from '../NodeProvider/NodeProvider';

type ComposeEmailStep =
  | 'idle'
  | 'opening'
  | 'open'
  | 'folding'
  | 'transporting';

type Props = {
  /**
   * NOTE: The following props are provided by a higher-order component,
   * defined at the base of this file.
   */
  handleClose: () => void,
  isOpen: boolean,
  nodes: {
    'compose-button': ?HTMLElement,
    outbox: HTMLElement,
  },
  windowWidth: number,
  windowHeight: any,
};

type EmailData = {
  from: 'Josh Comeau <joshwcomeau@gmail.com>',
  to: '',
  subject: '',
  body: '',
};

type EmailDataField = $Keys<typeof EmailData>;

type State = {
  status: ComposeEmailStep,
  actionBeingPerformed: 'send' | 'save' | 'delete' | null,
  emailData: EmailData,
};

class ComposeEmailContainer extends PureComponent<Props, State> {
  state = {
    status: 'idle',
    actionBeingPerformed: null,
    emailData: {
      from: 'Josh Comeau <joshwcomeau@gmail.com>',
      to: '',
      subject: '',
      body: '',
    },
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({ status: 'opening' });
    }
  }

  handleOpenOrClose = (status: 'open' | 'closed') => {
    if (status === 'closed') {
      // Reset for future opens
      this.setState({
        actionBeingPerformed: null,
        status: 'idle',
      });
    } else {
      this.setState({
        status: 'open',
      });
    }
  };

  sendEmail = () => {
    this.setState({ actionBeingPerformed: 'send', status: 'folding' });
  };

  finishAction = () => {
    // This is triggerd right after the letter is finished folding, for the
    // 'send' action.
    // In that case, we want to delay by a bit so that the user has time to see
    // the envelope.
    window.setTimeout(() => {
      this.setState({ status: 'transporting' });

      // This modal's open/close state is actually managed by the parent
      // <ModalProvider>. We can indicate that it should close once our letter
      // is "on the way"
      this.props.handleClose();
    }, 250);
  };

  renderFront() {
    return (
      <div>
        <ComposeEmail handleSend={this.sendEmail} />
      </div>
    );
  }

  renderBack() {
    return <ComposeEmailEnvelope />;
  }

  render() {
    const {
      handleClose,
      isOpen,
      nodes,
      windowWidth,
      windowHeight,
    } = this.props;
    const { status, actionBeingPerformed, emailData } = this.state;

    const fromNode = nodes['compose-button'];
    const toNode = actionBeingPerformed === 'send' ? nodes['outbox'] : fromNode;

    return (
      <Fragment>
        <Backdrop isOpen={isOpen} onClick={handleClose} />

        <ChildTransporter
          from={fromNode}
          to={toNode}
          isOpen={isOpen}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          handleFinishTransportation={this.handleOpenOrClose}
        >
          <FoldableLetter
            isFolded={status === 'folding' || status === 'transporting'}
            onCompleteFolding={this.finishAction}
            emailData={emailData}
            front={this.renderFront()}
            back={this.renderBack()}
          />
        </ChildTransporter>
      </Fragment>
    );
  }
}

const Backdrop = styled.div`
  position: absolute;
  z-index: ${Z_INDICES.modalBackdrop};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: ${props => (props.isOpen ? 0.25 : 0)};
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  transition: opacity 1000ms;
`;

// Thin HOC which collects information about:
//  - whether or not this modal is open
//  - the DOM nodes necessary for the open/close animation
//  - the window dimensions (width and height), needed by ChildTransporter
const withEnvironmentData = WrappedComponent => (props: any) => (
  <WindowDimensions>
    {({ windowWidth, windowHeight }) => (
      <ModalConsumer>
        {({ currentModal, closeModal }) => (
          <NodeConsumer>
            {({ nodes }) => (
              <WrappedComponent
                {...props}
                nodes={nodes}
                isOpen={currentModal === 'compose'}
                handleClose={closeModal}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              />
            )}
          </NodeConsumer>
        )}
      </ModalConsumer>
    )}
  </WindowDimensions>
);
export default withEnvironmentData(ComposeEmailContainer);
