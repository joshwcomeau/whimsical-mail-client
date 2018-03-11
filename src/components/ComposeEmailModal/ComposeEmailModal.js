// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';

import { COLORS } from '../../constants';
import { setTimeoutPromise } from '../../utils';
import airMailSrc from '../../assets/air-mail.png';

import Button from '../Button';
import ComposeEmailInput from '../ComposeEmailInput';
import Fold from '../Fold';

import type { FoldId } from '../../types';

type Props = {
  isOpen: boolean,
  triggerBoundingBox: ?ClientRect,
  handleClose: () => void,
};

type State = {
  isOpening: boolean,
  isClosing: boolean,
  rootX: ?number,
  rootY: ?number,
  foldId?: FoldId,
  foldableClone?: HTMLElement,
};

class ComposeEmailModal extends PureComponent<Props, State> {
  static defaultProps = {
    isOpen: false,
  };

  state = {
    isOpening: false,
    isClosing: false,
    rootX: null,
    rootY: null,
    foldId: undefined,
    foldableClone: undefined,
  };

  node: HTMLElement;
  foldedNode: HTMLElement;

  setStatePromise = (state: any): Promise<*> =>
    new Promise(resolve => {
      this.setState(state, resolve);
    });

  captureFoldedRef = (elem: HTMLElement) => {
    this.foldedNode = elem;
  };

  send = () => {
    const { height } = this.node.getBoundingClientRect();

    this.setState({
      isClosing: true,
      foldId: 'send',
      foldableClone: this.node.cloneNode(true),
    });
  };

  handleFinishFolding = async () => {
    const { foldId } = this.state;

    switch (foldId) {
      case 'send': {
        await this.setStatePromise({ addStamp: true });
      }
    }
  };

  render() {
    const { isOpen, handleClose, triggerBoundingBox } = this.props;
    const { isClosing, foldId, foldableClone } = this.state;

    // The very first render is a no-op, since we need the trigger node before
    // we can do anything
    if (!triggerBoundingBox) {
      return null;
    }

    const fastSpring = { stiffness: 150, damping: 20 };
    const slowSpring = { stiffness: 150, damping: 23 };

    return (
      <Wrapper isOpen={isOpen}>
        <Backdrop
          isOpen={isOpen}
          onClick={isClosing ? undefined : handleClose}
        />
        <Motion
          defaultStyle={{
            scaleX: 0,
            scaleY: 0,
            translateX: 0,
            translateY: 0,
          }}
          style={{
            scaleX: spring(isOpen ? 1 : 0, fastSpring),
            scaleY: spring(isOpen ? 1 : 0, slowSpring),
            translateX: spring(isOpen ? -5 : 0, fastSpring),
            translateY: spring(isOpen ? 5 : 0, fastSpring),
          }}
        >
          {({ scaleX, scaleY, translateX, translateY }) => (
            <ModalPositioner
              style={{
                top: triggerBoundingBox.bottom,
                right: window.innerWidth - triggerBoundingBox.left,
                transform: `
                  translate(${translateX}px, ${translateY}px)
                  scale(${scaleX}, ${scaleY})
                `,
                transformOrigin: 'top right',
                opacity: foldId ? 0 : 1,
              }}
            >
              <Modal innerRef={node => (this.node = node)}>
                <AirMailBorder />
                <ModalContents>
                  <Header>
                    <ComposeEmailInput
                      disabled
                      label="from"
                      value="Josh Comeau <joshua@khanacademy.org>"
                    />
                    <ComposeEmailInput
                      label="to"
                      placeholder="jane@example.com"
                    />
                  </Header>

                  <MainContent>
                    <Subject placeholder="Subject" />
                    <Body placeholder="Write something..." />
                  </MainContent>

                  <Footer>
                    <Button onClick={this.send}>
                      <SendIcon />
                    </Button>
                  </Footer>
                </ModalContents>
              </Modal>
            </ModalPositioner>
          )}
        </Motion>

        {foldId && (
          <Fold
            key={
              // Folds are meant to be "disposable".
              // They mount, they do their thing, they invoke the callback,
              // and then they unmount.
              // By supplying a key, we ensure that subsequent compositions
              // all animate correctly by building a new `Fold` instance.
              // TODO: This might be totally unnecessary, look into it!
              foldId
            }
            foldId={foldId}
            node={this.node}
            innerRef={this.captureFoldedRef}
            onCompleteFolding={this.handleFinishFolding}
          />
        )}
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
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: ${props => (props.isOpen ? 0.25 : 0)};
  transition: opacity 500ms;
`;

const ModalPositioner = styled.div`
  position: absolute;
  bottom: 100px;
  z-index: 2;
  min-width: 400px;
  width: 40%;
  will-change: transform;
`;

const Modal = styled.div`
  height: 100%;
`;

const ModalContents = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  margin: 8px;
  background: white;
`;

const AirMailBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: url(${airMailSrc});
  background-size: 64px;
`;

const Header = styled.div`
  padding: 15px 25px 20px 15px;
  background: ${COLORS.gray[100]};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 106px;
`;

const MainContent = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

const Footer = styled.div`
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  border-top: 1px solid ${COLORS.gray[200]};
`;

const InvisibleTextarea = styled.textarea`
  display: block;
  width: 100%;
  border: none;
  resize: none;
  outline: none;
`;

const Subject = styled(InvisibleTextarea)`
  font-size: 28px;
  padding: 15px 20px 20px;
  text-align: center;
`;
const Body = styled(InvisibleTextarea)`
  flex: 1;
  font-size: 18px;
`;

export default ComposeEmailModal;
