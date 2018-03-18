// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { Z_INDICES } from '../../constants';

import { ModalConsumer } from '../ModalProvider';
import { NodeConsumer } from '../NodeProvider';
import WindowDimensions from '../WindowDimensions';
import ChildTransporter from '../ChildTransporter';
import FoldableLetter from '../FoldableLetter';
import ComposeEmail from '../ComposeEmail';
import ComposeEmailEnvelope from '../ComposeEmailEnvelope';

import type { Nodes } from '../NodeProvider/NodeProvider';

type ComposeEmailStep = 'idle' | 'folding' | 'transporting';

type Props = {
  /**
   * NOTE: The following props are provided by a higher-order component,
   * defined at the base of this file.
   */
  handleClose: () => void,
  isOpen: boolean,
  to: ?HTMLElement,
  from: ?HTMLElement,
  windowWidth: number,
  windowHeight: any,
};

type State = {
  status: ComposeEmailStep,
  actionBeingPerformed: 'send' | 'save' | 'delete' | null,
};

class ComposeEmailContainer extends PureComponent<Props, State> {
  state = {
    status: 'idle',
    actionBeingPerformed: null,
  };

  handleOpenOrClose = (status: 'open' | 'closed') => {
    if (status === 'closed') {
      // Reset for future opens
      this.setState({
        status: 'idle',
        actionBeingPerformed: null,
      });
    }
  };

  sendEmail = () => {
    this.setState({ actionBeingPerformed: 'send', status: 'folding' });
  };

  finishAction = () => {
    this.setState({ actionBeingPerformed: null, status: 'transporting' });
    this.props.handleClose();

    // HACK: We want to wait until the transportation has completed before
    // we "unset" the folded state; otherwise it'll unfold in transit, and
    // that's not what a proper envelope should do!
    // Because we use Spring Physics(tm) for everything, though, we can't
    // simply use a TRANSPORT_DURATION constant. Instead, we'll guesstimate it
    // here, and tweak as needed based on the spring settings.
    //
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
      from,
      to,
      windowWidth,
      windowHeight,
    } = this.props;

    const { status, actionBeingPerformed } = this.state;
    console.log('status and ation', status, actionBeingPerformed);

    return (
      <Fragment>
        <Backdrop isOpen={isOpen} onClick={handleClose} />

        <ChildTransporter
          from={from}
          to={to}
          isOpen={isOpen}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          handleFinishTransportation={this.handleOpenOrClose}
        >
          <FoldableLetter
            isFolded={status === 'folding' || status === 'transporting'}
            onCompleteFolding={this.finishAction}
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
                from={nodes['compose-button']}
                to={nodes['outbox']}
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
