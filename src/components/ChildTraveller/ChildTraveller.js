// @flow
/**
 * This utility component can make its children appear from (or disappear to)
 * a given target HTMLElement.
 */
import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

type Props = {
  children: React$Node,
  direction: 'from' | 'to',
  target: ClientRect,
  windowWidth: number,
  windowHeight: number,
  handleFinishJourney?: () => void,
};

type State = {};

const fastSpring = { stiffness: 150, damping: 20 };
const slowSpring = { stiffness: 150, damping: 23 };

const mapQuadrantToTransformOrigin = (quadrant: number) => {
  switch (quadrant) {
    case 1:
      return 'top left';
    case 2:
      return 'top right';
    case 3:
      return 'bottom left';
    case 4:
      return 'bottom right';
    default:
      throw new Error(`Unrecognized quadrant: ${quadrant}`);
  }
};

class ChildTraveller extends Component<Props, State> {
  getTargetOffset() {
    const { target, windowWidth, windowHeight } = this.props;
    // When expanding from something, we want to use its "opposite" corner.
    // Imagine we divide the screen into quadrants:
    //  _______
    // | 1 | 2 |
    // |---|---|
    // | 3 | 4 |
    // --------
    //
    // If the target element is in the top-left quadrant (#2), we want to open
    // the children from its bottom-right corner. This way, the expande item is
    // most likely to fit comfortably on the screen:
    //
    // ------------------------------|
    //                    | target | |
    //                    /--------  |
    //        ----------/            |
    //       | children |            |
    //        ----------             |
    // ______________________________|

    const targetCenter = {
      x: target.left + target.width / 2,
      y: target.top + target.height / 2,
    };

    const windowCenter = {
      x: windowWidth / 2,
      y: windowHeight / 2,
    };

    // Sorry for the double-ternary! Just a simple mapping to the 4 quadrants
    // based on screen position.
    const quadrant =
      targetCenter.y < windowCenter.y
        ? targetCenter.x < windowCenter.x ? 1 : 2
        : targetCenter.x < windowCenter.x ? 3 : 4;

    // Now that we have the quadrant, we need to derive associated data, like:
    //  - the `transform-origin` for the children
    //  - the translate coordinates for the children
    const transformOrigin = mapQuadrantToTransformOrigin(quadrant);

    return { transformOrigin };
  }

  render() {
    const { target, direction, children } = this.props;

    let targetValues = {
      scaleX: spring(direction === 'from' ? 1 : 0),
      scaleY: spring(direction === 'from' ? 1 : 0),
    };

    const { transformOrigin } = this.getTargetOffset();

    if (direction === 'from') {
      targetValues = {
        scaleX: spring(1),
        scaleY: spring(1),
        translateX: spring(target.left),
        translateY: spring(target.top),
      };
    } else {
      targetValues = {
        scaleX: spring(0),
        scaleY: spring(0),
        translateX: spring(target.left),
        translateY: spring(target.top),
      };
    }

    return (
      <Motion
        defaultStyle={{
          scaleX: 0,
          scaleY: 0,
          translateX: target.left,
          translateY: target.top,
        }}
        style={targetValues}
      >
        {({ scaleX, scaleY, translateX, translateY }) => (
          <Wrapper
            style={{
              transform: `
                translate(${translateX}px, ${translateY}px)
                scale(${scaleX}, ${scaleY})
              `,
              transformOrigin,
            }}
          >
            {children}
          </Wrapper>
        )}
      </Motion>
    );
  }
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export default ChildTraveller;
