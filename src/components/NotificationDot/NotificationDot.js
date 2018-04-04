// @flow
import React, { PureComponent, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { Motion, spring } from 'react-motion';
import Sound from 'react-sound';

import { COLORS } from '../../constants';
// Flow doesn't believe this wav exists :/ $FlowFixMe
import popSoundSrc from '../../assets/pop.wav';

const MAIN_DOT_SPRING = { stiffness: 225, damping: 7 };
const FIRST_DOT_SPRING = { stiffness: 35, damping: 7 };
const SECOND_DOT_SPRING = { stiffness: 65, damping: 7 };
const THIRD_DOT_SPRING = { stiffness: 95, damping: 7 };

type Props = {
  size: number,
  isOpen: boolean,
};

class NotificationDot extends PureComponent<Props> {
  static defaultProps = {
    size: 8,
  };
  render() {
    const { size } = this.props;

    return (
      <Fragment>
        <Sound url={popSoundSrc} playStatus={Sound.status.PLAYING} />
        <Motion
          defaultStyle={{
            mainDotScale: 0,
            firstDotPositionX: 0,
            firstDotPositionY: 0,
            secondDotPositionX: 0,
            secondDotPositionY: 0,
            thirdDotPositionX: 0,
            thirdDotPositionY: 0,
          }}
          style={{
            mainDotScale: spring(1, MAIN_DOT_SPRING),
            firstDotPositionX: spring(size * -0.75, FIRST_DOT_SPRING),
            firstDotPositionY: spring(size * -0.35, FIRST_DOT_SPRING),
            secondDotPositionX: spring(size * 0.8, SECOND_DOT_SPRING),
            secondDotPositionY: spring(size * -0.3, SECOND_DOT_SPRING),
            thirdDotPositionX: spring(size * -0.2, THIRD_DOT_SPRING),
            thirdDotPositionY: spring(size * 0.9, THIRD_DOT_SPRING),
          }}
        >
          {({
            mainDotScale,
            firstDotPositionX,
            firstDotPositionY,
            secondDotPositionX,
            secondDotPositionY,
            thirdDotPositionX,
            thirdDotPositionY,
          }) => (
            <Wrapper>
              <MainDot
                color={COLORS.pink[500]}
                size={size}
                scale={mainDotScale}
              />
              <OtherDot
                size={size * 0.25}
                color={COLORS.purple[500]}
                x={firstDotPositionX}
                y={firstDotPositionY}
              />
              <OtherDot
                size={size * 0.5}
                color={COLORS.red[500]}
                x={secondDotPositionX}
                y={secondDotPositionY}
              />
              <OtherDot
                size={size * (5 / 8)}
                color={COLORS.blue[500]}
                x={thirdDotPositionX}
                y={thirdDotPositionY}
              />
            </Wrapper>
          )}
        </Motion>
      </Fragment>
    );
  }
}

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Wrapper = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  pointer-events: none;
`;

const Dot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const MainDot = styled(Dot).attrs({
  style: props => ({
    transform: `scale(${props.scale})`,
  }),
})`
  z-index: 2;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const OtherDot = styled(Dot).attrs({
  style: props => ({
    transform: `translate(${props.x}px, ${props.y}px)`,
  }),
})`
  z-index: 1;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  animation: ${fadeOut} 2s 300ms both;
`;

export default NotificationDot;
