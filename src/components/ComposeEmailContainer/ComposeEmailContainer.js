// @flow
import React, { PureComponent, Fragment } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import Sound from 'react-sound';

import { Z_INDICES } from '../../constants';
import { delay } from '../../utils';
// Flow doesn't like MP3s. $FlowFixMe
import wooshSoundSrc from '../../assets/woosh-2.mp3';

import { AuthenticationConsumer } from '../AuthenticationProvider';
import { ModalConsumer } from '../ModalProvider';
import { NodeConsumer } from '../NodeProvider';
import { EmailConsumer } from '../EmailProvider';
import WindowDimensions from '../WindowDimensions';
import Transport from '../Transport';
import Foldable from '../Foldable';
import ComposeEmail from '../ComposeEmail';
import ComposeEmailEnvelope from '../ComposeEmailEnvelope';
import EtchASketchShaker from '../EtchASketchShaker';

import type { UserData, EmailData, ComposingEmailData } from '../../types';

type ComposeEmailStep =
  | 'idle'
  | 'opening'
  | 'open'
  | 'folding'
  | 'transporting'
  | 'clearing';

type Props = {
  /**
   * NOTE: The following props are provided by a higher-order component,
   * defined at the base of this file.
   */
  handleClose: () => void,
  isOpen: boolean,
  replyTo: ?EmailData,
  openFromNode: HTMLElement,
  outboxNode: HTMLElement,
  draftsNode: HTMLElement,
  windowWidth: number,
  windowHeight: any,
  userData: UserData,
  addNewEmailToBox: (data: any) => void,
};

type State = {
  status: ComposeEmailStep,
  actionBeingPerformed: 'send' | 'save' | 'clear' | 'dismiss' | null,
  // `EmailData` is the type for sent email: it includes an ID and timestamp.
  // For email we're composing, we just want a subset.
  emailData: ComposingEmailData,
};

class ComposeEmailContainer extends PureComponent<Props, State> {
  state = {
    status: 'idle',
    actionBeingPerformed: null,
    emailData: {
      from: this.props.userData,
      toEmail: '',
      subject: '',
      body: '',
    },
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isOpen && nextProps.isOpen) {
      const initialState: $Shape<State> = {
        actionBeingPerformed: null,
        status: 'opening',
      };

      if (nextProps.replyTo) {
        initialState.emailData = {
          ...initialState.emailData,
          toEmail: nextProps.replyTo.from.email,
          subject: `RE: ${nextProps.replyTo.subject}`,
        };
      } else {
        initialState.emailData = {
          ...initialState.emailData,
          toEmail: '',
          subject: '',
          body: '',
        };
      }

      this.setState(initialState);
    }
  }

  setStatePromise = (newState: $Shape<State>) =>
    new Promise(resolve => this.setState(newState, resolve));

  updateField = (fieldName: string) => (ev: SyntheticInputEvent<*>) => {
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

  handleOpenOrClose = () => {
    const { actionBeingPerformed } = this.state;

    const isCreatingNewEmail =
      actionBeingPerformed === 'send' || actionBeingPerformed === 'save';

    const nextState = produce(this.state, draftState => {
      draftState.status = 'idle';
      draftState.actionBeingPerformed = null;

      if (isCreatingNewEmail) {
        draftState.emailData.toEmail = '';
        draftState.emailData.subject = '';
        draftState.emailData.body = '';
      }
    });

    if (isCreatingNewEmail) {
      const boxId = actionBeingPerformed === 'send' ? 'outbox' : 'drafts';
      this.props.addNewEmailToBox({ boxId, ...this.state.emailData });
    }

    this.setState(nextState);
  };

  sendEmail = () => {
    this.setState({ actionBeingPerformed: 'send', status: 'folding' });
  };

  saveEmail = () => {
    this.setState({ actionBeingPerformed: 'save', status: 'folding' });
  };

  clearEmail = async () => {
    // When clearing the email, we do an etch-a-sketch-like shake, with the
    // contents disappearing midway through.
    // This sequence is not interruptible, and so we'll do it all inline here.
    await this.setStatePromise({
      actionBeingPerformed: 'clear',
      status: 'clearing',
    });

    await delay(1000);

    this.setState({
      actionBeingPerformed: null,
      status: 'idle',
      emailData: {
        ...this.state.emailData,
        subject: '',
        body: '',
      },
    });
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
      <EtchASketchShaker shake={this.state.status === 'clearing'}>
        <ComposeEmail
          emailData={this.state.emailData}
          updateField={this.updateField}
          handleSend={this.sendEmail}
          handleSave={this.saveEmail}
          handleClear={this.clearEmail}
          isClearing={this.state.status === 'clearing'}
        />
      </EtchASketchShaker>
    );
  }

  renderBack() {
    if (this.state.actionBeingPerformed === 'save') {
      return null;
    }
    return <ComposeEmailEnvelope {...this.state.emailData} />;
  }

  render() {
    const {
      isOpen,
      openFromNode,
      outboxNode,
      draftsNode,
      windowWidth,
      windowHeight,
    } = this.props;
    const { status, actionBeingPerformed } = this.state;

    const toNode = actionBeingPerformed === 'send' ? outboxNode : draftsNode;

    let TransporterStatus = isOpen ? 'open' : 'closed';
    if (actionBeingPerformed === 'dismiss') {
      TransporterStatus = 'retracted';
    }

    return (
      <Fragment>
        <Backdrop isOpen={isOpen} onClick={this.dismiss} />

        <Sound
          autoLoad
          url={wooshSoundSrc}
          playFromPosition={850}
          volume={40}
          playStatus={
            status === 'transporting'
              ? Sound.status.PLAYING
              : Sound.status.STOPPED
          }
        />

        <Transport
          from={openFromNode}
          to={toNode}
          status={TransporterStatus}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          handleFinishTransportation={this.handleOpenOrClose}
        >
          <Foldable
            isFolded={status === 'folding' || status === 'transporting'}
            onCompleteFolding={this.finishAction}
            front={this.renderFront()}
            back={this.renderBack()}
          />
        </Transport>
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
  <AuthenticationConsumer>
    {({ userData }) => (
      <ModalConsumer>
        {({ currentModal, openFromNode, closeModal, isReply }) => (
          <NodeConsumer>
            {({ nodes }) => (
              <EmailConsumer>
                {({ selectedEmailId, emails, addNewEmailToBox }) => (
                  <WindowDimensions>
                    {({ windowWidth, windowHeight }) => (
                      <WrappedComponent
                        {...props}
                        userData={userData}
                        replyTo={isReply ? emails.get(selectedEmailId) : null}
                        openFromNode={openFromNode}
                        outboxNode={nodes.outbox}
                        draftsNode={nodes.drafts}
                        nodes={nodes}
                        isOpen={currentModal === 'compose'}
                        handleClose={closeModal}
                        addNewEmailToBox={addNewEmailToBox}
                        windowWidth={windowWidth}
                        windowHeight={windowHeight}
                      />
                    )}
                  </WindowDimensions>
                )}
              </EmailConsumer>
            )}
          </NodeConsumer>
        )}
      </ModalConsumer>
    )}
  </AuthenticationConsumer>
);
export default withEnvironmentData(ComposeEmailContainer);
