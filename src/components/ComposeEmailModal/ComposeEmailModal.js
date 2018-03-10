// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';

import { COLORS } from '../../constants';

import Button from '../Button';
import ComposeEmailInput from '../ComposeEmailInput';

type Props = {
  isOpen: boolean,
  triggerBoundingBox: ?DOMRect,
  handleClose: () => void,
};

type State = {
  isOpening: boolean,
  isClosing: boolean,
  rootX: ?number,
  rootY: ?number,
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
  };

  node: HTMLElement;

  send = () => {
    const nodeClone = this.node.cloneNode(true);

    // Add a container to the DOM to hold our clone
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex = '10000';
    container.style.top = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.bottom = '0';

    container.appendChild(nodeClone);
    document.body.appendChild(container);
  };

  render() {
    const { isOpen, handleClose, triggerBoundingBox } = this.props;

    // The very first render is a no-op, since we need the trigger node before
    // we can do anything
    if (!triggerBoundingBox) {
      return null;
    }

    const fastSpring = { stiffness: 150, damping: 20 };
    const slowSpring = { stiffness: 150, damping: 23 };

    return (
      <Wrapper isOpen={isOpen}>
        <Backdrop isOpen={isOpen} onClick={handleClose} />
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
            <Modal
              innerRef={node => (this.node = node)}
              style={{
                top: triggerBoundingBox.bottom,
                right: window.innerWidth - triggerBoundingBox.left,
                transform: `
                  translate(${translateX}px, ${translateY}px)
                  scale(${scaleX}, ${scaleY})
                `,
                transformOrigin: 'top right',
              }}
            >
              <Header>
                <ComposeEmailInput
                  disabled
                  label="from"
                  value="Josh Comeau <joshua@khanacademy.org>"
                />
                <ComposeEmailInput label="to" placeholder="jane@example.com" />
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
            </Modal>
          )}
        </Motion>
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
  opacity: ${props => (props.isOpen ? 0.15 : 0)};
  transition: opacity 500ms;
`;

const Modal = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  bottom: 100px;
  min-width: 400px;
  width: 40%;
  background: white;
  box-shadow: 0px 5px 60px rgba(0, 0, 0, 0.4);
  will-change: transform;
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
