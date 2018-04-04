// @flow
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  children: React$Node,
  shake: boolean,
};

class EtchASketchShaker extends Component<Props> {
  render() {
    return (
      <Rotate shake={this.props.shake}>
        <ShakeUpDown shake={this.props.shake}>
          {this.props.children}
        </ShakeUpDown>
      </Rotate>
    );
  }
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-2deg);
  }

  50% {
    transform: rotate(3deg);
  }

  75% {
    transform: rotate(-1deg);
  }

  95% {
    transform: rotate(0deg);
  }
`;

const shakeUpDown = keyframes`
  0% {
    transform: translateY(0);
  }

  12.5% {
    transform: translateY(20px);
  }

  25% {
    transform: translateY(-20px);
  }

  37.5% {
    transform: translateY(20px);
  }

  50% {
    transform: translateY(-40px);
  }

  62.5% {
    transform: translateY(20px);
  }

  75% {
    transform: translateY(-20px);
  }


  100% {
    transform: translateY(0);
  }
`;

const Rotate = styled.div`
  transform-origin: bottom center;
  animation: ${props => (props.shake ? `${rotate} 1000ms alternate` : null)};
  animation-iteration-count: 1;
`;

const ShakeUpDown = styled.div`
  animation: ${props => (props.shake ? `${shakeUpDown} 1000ms` : null)};
  animation-iteration-count: 1;
`;

export default EtchASketchShaker;
