// @flow
/**
 * This utility component can make its children appear from (or disappear to)
 * a given target HTMLElement.
 */
import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import {
  getPositionDelta,
  applyStylesToDOMNode,
} from './ChildTraveller.helpers';
import type { AugmentedClientRect } from './ChildTraveller.types';

type Quadrant = 1 | 2 | 3 | 4;
type Position = {
  top?: number,
  left?: number,
  right?: number,
  bottom?: number,
};

const fastSpring = { stiffness: 150, damping: 20 };
const slowSpring = { stiffness: 150, damping: 23 };

const createAugmentedClientRect = (
  node: HTMLElement,
  windowWidth: number,
  windowHeight: number
): AugmentedClientRect => {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,

    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,

    fromBottomRight: {
      top: windowHeight - rect.top,
      left: windowWidth - rect.left,
      right: windowWidth - rect.right,
      bottom: windowHeight - rect.bottom,
      centerX: windowWidth - rect.right + rect.width / 2,
      centerY: windowHeight - rect.bottom + rect.height / 2,
    },
  };
};

type Status = 'idle' | 'inverted' | 'playing';

type Props = {
  children: React$Node,
  direction: 'from' | 'to',
  target: HTMLElement,
  windowWidth: number,
  windowHeight: number,
};

type State = {
  targetRect: ?AugmentedClientRect,
  childRect: ?AugmentedClientRect,
  status: Status,
  translateX: ?number,
  translateY: ?number,
};

class ChildTraveller extends Component<Props, State> {
  childWrapperNode: HTMLElement;

  state = {
    targetRect: null,
    childRect: null,
    status: 'idle',
    translateX: null,
    translateY: null,
  };

  componentDidMount() {
    const { targetRect, childRect } = this.getAugmentedClientRects();

    this.setState({ targetRect, childRect });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { targetRect, childRect } = this.getAugmentedClientRects(nextProps);

    // When the component receives props, it can mean that our child is about
    // to start moving. We need to record its current position, as that'll
    // serve as the 'initial' position to animate from.
    this.setState({ targetRect, childRect });
  }

  componentDidUpdate(prevProps: Props) {
    const { childRect, status } = this.state;

    const hasTargetChanged = this.props.target !== prevProps.target;

    // TODO: interrupts?

    if (childRect && hasTargetChanged) {
      this.invertNode();
    }

    if (status === 'inverted') {
      this.undoInversion();
    }
  }

  invertNode() {
    const { windowWidth, windowHeight } = this.props;
    const { childRect: oldChildRect } = this.state;

    // Should be impossible, but Flow
    if (!oldChildRect) {
      throw new Error(
        'No oldChildRect found! Is `invertNode` being called somewhere unexpected?'
      );
    }

    window.requestAnimationFrame(() => {
      const newChildRect = createAugmentedClientRect(
        this.childWrapperNode,
        windowWidth,
        windowHeight
      );

      const [x, y] = getPositionDelta(oldChildRect, newChildRect);

      this.setState({ translateX: x, translateY: y, status: 'inverted' });

      // // FLIP Animation Time!
      // // First: the position in this.state.childRect
      // // Last: the newChildRect we just captured.
      // // Invert: Let's calculate and apply the inverse translation.
      // const inverseTranslation = `translate(${x}px, ${y}px)`;

      // applyStylesToDOMNode(this.childWrapperNode, {
      //   transform: inverseTranslation,
      //   transition: 'transform 0ms',
      // });

      // window.requestAnimationFrame(() => {
      //   applyStylesToDOMNode(this.childWrapperNode, {
      //     transform: 'translate(0px, 0px)',
      //     transition: 'transform 1500ms',
      //   });
      // });
    });
  }

  undoInversion = () => {
    this.setState({
      translateX: 0,
      translateY: 0,
      status: 'playing',
    });
  };

  finishPlaying = () => {
    this.setState({ status: 'idle' });
  };

  getAugmentedClientRects(props: Props = this.props) {
    const { target, windowWidth, windowHeight } = props;

    return {
      targetRect: createAugmentedClientRect(target, windowWidth, windowHeight),
      childRect: createAugmentedClientRect(
        this.childWrapperNode,
        windowWidth,
        windowHeight
      ),
    };
  }

  getTargetQuadrant() {
    const { target, windowWidth, windowHeight } = this.props;
    const { targetRect } = this.state;

    if (!targetRect) {
      return 1;
    }

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

    const windowCenter = {
      x: windowWidth / 2,
      y: windowHeight / 2,
    };

    if (targetRect.centerY < windowCenter.y) {
      // top half, left or right
      return targetRect.centerX < windowCenter.x ? 1 : 2;
    } else {
      // bottom half, left or right
      return targetRect.centerX < windowCenter.x ? 3 : 4;
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

  getChildPosition(quadrant: Quadrant): ?Position {
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
    const { direction, windowWidth, windowHeight } = this.props;
    const { targetRect, childRect } = this.state;

    // Shouldn't be possible, but Flow doesn't know that.
    // TODO: Improve this.
    if (!targetRect || !childRect) {
      return null;
    }

    switch (quadrant) {
      case 1:
        return {
          top:
            direction === 'from'
              ? targetRect.bottom
              : targetRect.centerY - childRect.height / 2,
          left:
            direction === 'from'
              ? targetRect.right
              : targetRect.centerX - childRect.width / 2,
        };
      case 2:
        return {
          top:
            direction === 'from'
              ? targetRect.bottom
              : targetRect.centerY - childRect.height / 2,
          right:
            direction === 'from'
              ? targetRect.fromBottomRight.left
              : targetRect.fromBottomRight.centerX - childRect.width / 2,
        };
      case 3:
        return {
          bottom:
            direction === 'from'
              ? targetRect.fromBottomRight.top
              : targetRect.fromBottomRight.centerY - childRect.height / 2,
          left:
            direction === 'from'
              ? targetRect.right
              : targetRect.centerX - childRect.width / 2,
        };
      case 4:
        return {
          bottom:
            direction === 'from'
              ? targetRect.fromBottomRight.top
              : targetRect.fromBottomRight.centerY - childRect.height / 2,
          right:
            direction === 'from'
              ? targetRect.fromBottomRight.left
              : targetRect.fromBottomRight.centerX - childRect.width / 2,
        };
      default:
        throw new Error(`Unrecognized quadrant: ${quadrant}`);
    }
  }

  render() {
    const { target, direction, children } = this.props;

    const quadrant = this.getTargetQuadrant();

    const transformOrigin = this.getTargetTransformOrigin(quadrant);

    let targetValues = {
      ...this.getChildPosition(quadrant),
      scaleX: 1,
      scaleY: 1,
    };
    switch (this.state.status) {
      case 'idle': {
        targetValues = {
          ...targetValues,
          translateX: 0,
          translateY: 0,
        };
        break;
      }
      case 'inverted': {
        targetValues = {
          ...targetValues,
          translateX: this.state.translateX,
          translateY: this.state.translateY,
          scaleX: this.props.direction === 'to' ? 1 : 0,
          scaleY: this.props.direction === 'to' ? 1 : 0,
        };
        break;
      }
      case 'playing': {
        targetValues = {
          ...targetValues,
          translateX: this.props.direction === 'to' ? spring(0) : 0,
          translateY: this.props.direction === 'to' ? spring(0) : 0,
          scaleX: spring(this.props.direction === 'to' ? 0 : 1),
          scaleY: spring(this.props.direction === 'to' ? 0 : 1),
        };
        break;
      }
    }

    console.log(targetValues);

    // if (this.childWrapperNode) {
    //   // const { translateX, translateY } = this.getTargetTranslate(quadrant);

    //   targetValues = {
    //     scaleX: spring(direction === 'from' ? 1 : 0),
    //     scaleY: spring(direction === 'from' ? 1 : 0),
    //     ...this.getChildPosition(quadrant),
    //     // translateX: direction === 'from' ? translateX : spring(translateX),
    //     // translateY: direction === 'from' ? translateY : spring(translateY),
    //   };
    // } else {
    //   targetValues = {
    //     scaleX: 0,
    //     scaleY: 0,
    //   };
    // }

    return (
      <Motion
        defaultStyle={{
          scaleX: 1,
          scaleY: 1,
          // translateX: target.left,
          // translateY: target.top,
        }}
        style={targetValues}
        onRest={this.finishPlaying}
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
