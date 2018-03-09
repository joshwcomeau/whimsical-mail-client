// @flow
import React, { PureComponent } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { COLORS } from '../../constants';

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

  // componentWillReceiveProps(nextProps: Props) {
  //   console.log('is opening', this.state.isOpening);

  //   // Here we check if the modal is opening. If so, trigger the animation!
  //   if (!this.props.isOpen && nextProps.isOpen && !this.state.isOpening) {
  //     if (!nextProps.openFromNode) {
  //       throw new Error(
  //         'Tried to open a modal, but no `openFromNode` provided'
  //       );
  //     }

  //     const triggerBoundingBox = nextProps.openFromNode.getBoundingClientRect();
  //     const modalBoundingBox = this.node.getBoundingClientRect();

  //     // TODO: Logic to determine the transform-origin based on its viewport
  //     // position?

  //     const rootX = triggerBoundingBox.left - modalBoundingBox.right;
  //     const rootY = triggerBoundingBox.bottom - modalBoundingBox.top;

  //     console.log('Setting state');
  //     this.setState({ rootX, rootY, isOpening: true });
  //   }
  // }

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
                <Subject>Subject</Subject>
                <Body />
              </MainContent>
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
  padding: 30px;
`;

const Subject = styled.h2`
  font-size: 28px;
`;
const Body = styled.textarea``;

export default ComposeEmailModal;
