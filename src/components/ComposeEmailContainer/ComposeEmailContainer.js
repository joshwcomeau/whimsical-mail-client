// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { Z_INDICES } from '../../constants';
import { debounce } from '../../utils';

import { ModalConsumer } from '../ModalProvider';
import { NodeConsumer } from '../NodeProvider';
import { EmailConsumer } from '../EmailProvider';
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
  addNewEmailToBox: (data: any) => void,
};

type EmailData = {
  fromEmail: string,
  toEmail: string,
  subject: string,
  body: string,
};

type EmailDataField = $Keys<EmailData>;

type State = {
  status: ComposeEmailStep,
  actionBeingPerformed: 'send' | 'save' | 'delete' | 'dismiss' | null,
  emailData: EmailData,
};

class ComposeEmailContainer extends PureComponent<Props, State> {
  state = {
    status: 'idle',
    actionBeingPerformed: null,
    emailData: {
      fromEmail: 'Josh Comeau <joshwcomeau@gmail.com>',
      toEmail: '',
      subject: '',
      body: '',
    },
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({ status: 'opening' });
    }
  }

  updateField = (fieldName: string) => (ev: SyntheticInputEvent) => {
    this.setState({
      emailData: {
        ...this.state.emailData,
        [fieldName]: ev.target.value,
      },
    });
  };

  dismiss = () => {
    this.setState({ actionBeingPerformed: 'dismiss' });
    this.props.handleClose();
  };

  handleOpenOrClose = (status: 'open' | 'closed') => {
    const { actionBeingPerformed } = this.state;

    if (status === 'closed') {
      if (actionBeingPerformed === 'send' || actionBeingPerformed === 'save') {
        const boxId = actionBeingPerformed === 'send' ? 'outbox' : 'drafts';

        this.props.addNewEmailToBox({ boxId, ...this.state.emailData });
      }

      // Reset for future opens
      this.setState({
        actionBeingPerformed: null,
        status: 'idle',
      });
    } else {
      this.setState({
        actionBeingPerformed: null,
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
      <ComposeEmail
        {...this.state.emailData}
        updateField={this.updateField}
        handleSend={this.sendEmail}
      />
    );
  }

  renderBack() {
    return <ComposeEmailEnvelope {...this.state.emailData} />;
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
    const toNode = nodes['outbox'];

    let childTransporterStatus = isOpen ? 'open' : 'closed';
    if (actionBeingPerformed === 'dismiss') {
      childTransporterStatus = 'retracted';
    }

    return (
      <Fragment>
        <Backdrop isOpen={isOpen} onClick={this.dismiss} />

        <ChildTransporter
          from={fromNode}
          to={toNode}
          status={childTransporterStatus}
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

// Thin wrapper which aggregates a bunch of different render-prop data
// providers. This is not a very nice-looking solution, but at the time of
// writing, no native `adopt` solution exists, and libraries like react-adopt
// aren't compelling enough to be worth it for a demo.
const withEnvironmentData = WrappedComponent => (props: any) => (
  <WindowDimensions>
    {({ windowWidth, windowHeight }) => (
      <ModalConsumer>
        {({ currentModal, closeModal }) => (
          <NodeConsumer>
            {({ nodes }) => (
              <EmailConsumer>
                {({ addNewEmailToBox }) => (
                  <WrappedComponent
                    {...props}
                    nodes={nodes}
                    isOpen={currentModal === 'compose'}
                    handleClose={closeModal}
                    addNewEmailToBox={addNewEmailToBox}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                  />
                )}
              </EmailConsumer>
            )}
          </NodeConsumer>
        )}
      </ModalConsumer>
    )}
  </WindowDimensions>
);
export default withEnvironmentData(ComposeEmailContainer);
