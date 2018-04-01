// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

import { COLORS } from '../../constants';

type Status = 'closed' | 'opening' | 'open' | 'closing';

type Props = {
  isOpen: boolean,
};
type State = {
  status: Status,
};

class NotificationDot extends Component<Props, State> {
  state = {
    status: 'closed',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('get derived', this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen && !nextProps.isOpen) {
      this.setState({ status: 'closing' });
      return;
    }

    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({ status: 'opening' });
      return;
    }
  }

  getStylesForStatus = (status: Status) => {
    switch (status) {
      case 'closed': {
        return {
          mainDotScale: 0,
          firstDotPositionX: 0,
          firstDotPositionY: 0,
          firstDotScale: 1,
          secondDotPositionX: 0,
          secondDotPositionY: 0,
          secondDotScale: 1,
          thirdDotPositionX: 0,
          thirdDotPositionY: 0,
          thirdDotScale: 1,
        };
      }

      case 'opening': {
        return {
          mainDotScale: spring(1),
          firstDotPositionX: spring(-20),
          firstDotPositionY: spring(-16),
          firstDotScale: spring(0),
          secondDotPositionX: spring(10),
          secondDotPositionY: spring(-6),
          secondDotScale: spring(0),
          thirdDotPositionX: spring(-5),
          thirdDotPositionY: spring(25),
          thirdDotScale: spring(0),
        };
      }

      case 'open': {
        return {
          mainDotScale: 1,
          firstDotPositionX: 0,
          firstDotPositionY: 0,
          firstDotScale: 0,
          secondDotPositionX: 0,
          secondDotPositionY: 0,
          secondDotScale: 0,
          thirdDotPositionX: 0,
          thirdDotPositionY: 0,
          thirdDotScale: 0,
        };
      }

      case 'closing': {
        return {
          mainDotScale: spring(0),
          firstDotPositionX: 0,
          firstDotPositionY: 0,
          firstDotScale: 0,
          secondDotPositionX: 0,
          secondDotPositionY: 0,
          secondDotScale: 0,
          thirdDotPositionX: 0,
          thirdDotPositionY: 0,
          thirdDotScale: 0,
        };
      }

      default:
        throw new Error('Unrecognized NotificationDot status');
    }
  };

  render() {
    const { isOpen } = this.props;

    return (
      <Motion style={this.getStylesForStatus(this.state.status)}>
        {({
          mainDotScale,
          firstDotPositionX,
          firstDotPositionY,
          firstDotScale,
          secondDotPositionX,
          secondDotPositionY,
          secondDotScale,
          thirdDotPositionX,
          thirdDotPositionY,
          thirdDotScale,
        }) => (
          <Wrapper>
            <MainDot scale={mainDotScale} />
          </Wrapper>
        )}
      </Motion>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
`;

const MainDot = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  background-color: ${COLORS.red[500]};
  transform: ${props => `scale(${props.scale})`};
`;

export default NotificationDot;
