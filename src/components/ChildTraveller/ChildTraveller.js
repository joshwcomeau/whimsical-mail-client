// @flow
/**
 * This utility component can make its children appear from (or disappear to)
 * a given target HTMLElement.
 */
import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

// TODO: maybe it'd be better to have:
// fromTarget, toTarget, isOpen
// ?

type Props = {
  children: React$Node,
  direction: 'from' | 'to',
  target: ClientRect,
  windowWidth: number,
  windowHeight: number,
  handleFinishJourney?: () => void,
};

type State = {};

type Quadrant = 1 | 2 | 3 | 4;

const fastSpring = { stiffness: 150, damping: 20 };
const slowSpring = { stiffness: 150, damping: 23 };

class ChildTraveller extends Component<Props, State> {
  childWrapper: HTMLElement;

  componentDidMount() {
    this.forceUpdate();
  }

  getTargetQuadrant() {
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

    if (targetCenter.y < windowCenter.y) {
      // top half, left or right
      return targetCenter.x < windowCenter.x ? 1 : 2;
    } else {
      // bottom half, left or right
      return targetCenter.x < windowCenter.x ? 3 : 4;
    }
  }

  getTargetTranslate(quadrant: Quadrant) {
    const { target } = this.props;

    const childBox = this.childWrapper.getBoundingClientRect();

    // If we're going "to" the target, we want to disappear into its center.
    if (this.props.direction === 'to') {
      return {
        translateX: target.left + target.width / 2 - childBox.width / 2,
        translateY: target.top + target.height / 2 - childBox.height / 2,
      };
    }

    // Otherwise, the translate values will be based on the quadrant.
    console.log(childBox.width);
    switch (quadrant) {
      case 1:
        return {
          translateX: target.right,
          translateY: target.bottom,
        };
      case 2:
        return {
          translateX: target.left - childBox.width,
          translateY: target.bottom,
        };
      case 3:
        return {
          translateX: target.right,
          translateY: target.top,
        };
      case 4:
        return {
          translateX: target.left,
          translateY: target.top,
        };
      default:
        throw new Error(`Unrecognized quadrant: ${quadrant}`);
    }
  }

  getTargetTransformOrigin(quadrant: Quadrant) {
    // If we're going "to" the target, we want to disappear into its center.
    // For this reason, the transform-origin will always be the middle.
    if (this.props.direction === 'to') {
      return 'center center';
    }

    // If we're coming "from" the target, the transform-origin depends on the
    // quadrant. We want to expand outward from the element, after all.
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
  }

  render() {
    const { target, direction, children } = this.props;

    const quadrant = this.getTargetQuadrant();

    const transformOrigin = this.getTargetTransformOrigin(quadrant);

    let targetValues;
    if (this.childWrapper) {
      const { translateX, translateY } = this.getTargetTranslate(quadrant);

      targetValues = {
        scaleX: spring(direction === 'from' ? 1 : 0),
        scaleY: spring(direction === 'from' ? 1 : 0),
        translateX: direction === 'from' ? translateX : spring(translateX),
        translateY: direction === 'from' ? translateY : spring(translateY),
      };
    } else {
      targetValues = {
        scaleX: 0,
        scaleY: 0,
      };
    }

    return (
      <Motion
        defaultStyle={{
          scaleX: 1,
          scaleY: 1,
          translateX: target.left,
          translateY: target.top,
        }}
        style={targetValues}
      >
        {({ scaleX, scaleY, translateX, translateY }) => (
          <OuterWrapper
            innerRef={node => (this.childWrapper = node)}
            style={{ display: 'inline-block' }}
          >
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
          </OuterWrapper>
        )}
      </Motion>
    );
  }
}

const OuterWrapper = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
`;

const Wrapper = styled.div``;

export default ChildTraveller;
