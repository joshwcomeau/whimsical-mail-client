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

type State = {
  cachedTarget?: ClientRect,
};

type Quadrant = 1 | 2 | 3 | 4;
type Position = {
  top?: number,
  left?: number,
  right?: number,
  bottom?: number,
};

const fastSpring = { stiffness: 150, damping: 20 };
const slowSpring = { stiffness: 150, damping: 23 };

class ChildTraveller extends Component<Props, State> {
  childWrapperNode: HTMLElement;
  state = {};

  componentDidMount() {
    this.setState({
      cachedTarget: this.childWrapperNode.getBoundingClientRect(),
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      cachedTarget: this.childWrapperNode.getBoundingClientRect(),
    });
  }

  componentDidUpdate(prevProps: Props) {
    const hasPositionChanged = this.props.target !== prevProps.target;

    if (hasPositionChanged) {
      const newChildLocation = this.childWrapperNode.getBoundingClientRect();
    }
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

    const childBox = this.childWrapperNode.getBoundingClientRect();

    // If we're going "to" the target, we want to disappear into its center.
    if (this.props.direction === 'to') {
      return {
        translateX: target.left + target.width / 2 - childBox.width / 2,
        translateY: target.top + target.height / 2 - childBox.height / 2,
      };
    }

    // Otherwise, the translate values will be based on the quadrant.
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

  getChildPosition(quadrant: Quadrant): Position {
    /**
     * Get the top/left/right/bottom position for the child, relative to the
     * current target.
     *
     * This depends on a few factors:
     *
     * 1. QUADRANT
     *     The quadrant affects how the child will be positioned relative to the
     *     target. In the first quadrant (top-left), the box opens from the
     *     target's bottom-right corner:
     *      _____
     *     |  T  |
     *     |_____| _____                     T = target
     *            |  C  |                    C = child
     *            |_____|
     *
     *     When we're in the second quadrant, though, the child opens to the
     *     _left_ of the target:
     *                                                         _____
     *                                                        |  T  |
     *                                                  _____  -----
     *                                                |  C  |
     *                                                 -----
     *     Effectively, each quadrant causes the child to open from the target's
     *     _opposite corner_. This is to ensure that the child opens on-screen
     *     (if it always opened to the top-right, and the target was also in
     *     the top-right corner, it would render outside of the viewport).
     *
     * 2. DIRECTION
     *     When the direction is `from` the target, we want to open from its
     *     opposite corner (as shown in 1. QUADRANT).
     *     When the direction is `to`, though, we want to align the target's
     *     center-point to the child's center-point:
     *
     *     `from`:
     *      _______
     *     |       |
     *     |   T   |
     *     |       |                        T = target
     *      ------- ___                     C = child
     *             | C |
     *              ---
     *
     *     `to`:
     *      _______
     *     |  ___  |
     *     | | C | |
     *     |  ---  |
     *      -------
     *
     *     The reason for this is that when travelling TO an element, we're also
     *     shrinking it. We want it to disappear into the target, and so we
     *     position it right in the center.
     */
    const { target, direction, windowWidth, windowHeight } = this.props;

    const childBox = this.childWrapperNode.getBoundingClientRect();

    const childBoxCenter = {
      x: childBox.left + childBox.width / 2,
      y: childBox.top + childBox.height / 2,
    };

    const targetCenter = {
      x: target.left + target.width / 2,
      y: target.top + target.height / 2,
    };

    switch (quadrant) {
      case 1:
        return {
          top:
            direction === 'from'
              ? target.bottom
              : targetCenter.y - childBox.height / 2,
          left:
            direction === 'from'
              ? target.right
              : targetCenter.x - childBox.width / 2,
        };
      case 2:
        return {
          top:
            direction === 'from'
              ? target.bottom
              : targetCenter.y - childBox.height / 2,
          right:
            direction === 'from'
              ? windowWidth - target.left
              : windowWidth - targetCenter.x - childBox.width / 2,
        };
      case 3:
        return {
          bottom:
            direction === 'from'
              ? windowHeight - target.top
              : windowHeight - targetCenter.y - childBox.height / 2,
          left:
            direction === 'from'
              ? target.right
              : targetCenter.x - childBox.width / 2,
        };
      case 4:
        return {
          bottom:
            direction === 'from'
              ? windowHeight - target.top
              : windowHeight - targetCenter.y - childBox.height / 2,
          right:
            direction === 'from'
              ? windowWidth - target.left
              : windowWidth - targetCenter.x - childBox.width / 2,
        };
      default:
        throw new Error(`Unrecognized quadrant: ${quadrant}`);
    }
  }

  render() {
    const { target, direction, children } = this.props;

    const quadrant = this.getTargetQuadrant();

    const transformOrigin = this.getTargetTransformOrigin(quadrant);

    let targetValues;
    if (this.childWrapperNode) {
      // const { translateX, translateY } = this.getTargetTranslate(quadrant);

      targetValues = {
        scaleX: spring(direction === 'from' ? 1 : 0),
        scaleY: spring(direction === 'from' ? 1 : 0),
        ...this.getChildPosition(quadrant),
        // translateX: direction === 'from' ? translateX : spring(translateX),
        // translateY: direction === 'from' ? translateY : spring(translateY),
      };
    } else {
      targetValues = {
        scaleX: 0,
        scaleY: 0,
      };
    }

    console.log(targetValues);

    return (
      <Motion
        defaultStyle={{
          scaleX: 1,
          scaleY: 1,
          // translateX: target.left,
          // translateY: target.top,
        }}
        style={targetValues}
      >
        {({
          scaleX,
          scaleY,
          translateX,
          translateY,
          top,
          left,
          bottom,
          right,
        }) => (
          <Wrapper
            innerRef={node => (this.childWrapperNode = node)}
            style={{
              top,
              left,
              bottom,
              right,
              // transform: `
              //       translate(${translateX}px, ${translateY}px)
              //       scale(${scaleX}, ${scaleY})
              //     `,
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

const OuterWrapper = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
`;

const Wrapper = styled.div`
  position: absolute;
`;

export default ChildTraveller;
