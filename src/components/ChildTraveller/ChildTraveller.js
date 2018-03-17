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
  createAugmentedClientRect,
  createAugmentedClientRectFromMinimumData,
} from './ChildTraveller.helpers';
import type {
  AugmentedClientRect,
  MinimumFixedPosition,
} from './ChildTraveller.types';

type Quadrant = 1 | 2 | 3 | 4;

const fastSpring = { stiffness: 150, damping: 20 };
const slowSpring = { stiffness: 150, damping: 23 };

type Status =
  | 'closed'
  | 'start-opening'
  | 'opening'
  | 'open'
  | 'start-closing'
  | 'closing';

type StartStatus = 'start-opening' | 'start-closing';

type Props = {
  children: React$Node,
  from: HTMLElement,
  to: HTMLElement,
  isOpen: boolean,
  windowWidth: number,
  windowHeight: number,
};

type State = {
  fromRect: ?AugmentedClientRect,
  toRect: ?AugmentedClientRect,
  childRect: ?AugmentedClientRect,
  status: Status,
  position: {
    top?: number,
    left?: number,
    right?: number,
    bottom?: number,
    translateX: number,
    translateY: number,
    scaleX: number,
    scaleY: number,
  },
};

const isClosingOrClosed = (status: Status) => {
  switch (status) {
    case 'start-closing':
    case 'closing':
    case 'closed': {
      return true;
    }
    default:
      return false;
  }
};

const incrementStatus = (currentStatus: Status) => {
  const STATUSES: Array<Status> = [
    'closed',
    'start-opening',
    'opening',
    'open',
    'start-closing',
    'closing',
  ];

  const currentIndex = STATUSES.indexOf(currentStatus);

  if (currentIndex === -1) {
    throw new Error(
      'Invalid Status provided. Acceptable values: ' + STATUSES.join(', ')
    );
  }

  const nextIndex = (currentIndex + 1) % STATUSES.length;
  return STATUSES[nextIndex];
};

class ChildTraveller extends Component<Props, State> {
  childWrapperNode: HTMLElement;

  state = {
    fromRect: null,
    toRect: null,
    childRect: null,
    status: 'closed', // TODO depend on props.isOpen
    position: {
      scaleX: 0,
      scaleY: 0,
      translateX: 0,
      translateY: 0,
    },
  };

  componentDidMount() {
    // TODO: We probably don't need `toRect` right away, maybe defer this?
    const { fromRect, toRect, childRect } = this.getAugmentedClientRects();

    this.setState({ fromRect, toRect, childRect });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { fromRect, toRect, childRect } = this.getAugmentedClientRects(
      nextProps
    );

    // TODO: We don't have to do this in EVERY cWRP. Be more picky!

    // When the component receives props, it can mean that our child is about
    // to start moving. We need to record its current position, as that'll
    // serve as the 'initial' position to animate from.
    this.setState({ fromRect, toRect, childRect });
  }

  componentDidUpdate(prevProps: Props) {
    const { status } = this.state;

    // We care about changes to the modal's "open" status (if the user has
    // toggled it open or closed)
    const wasJustToggled = prevProps.isOpen !== this.props.isOpen;

    // TODO: This should probably move to cWRP, so that the whole cycle isn't
    // required right?
    if (wasJustToggled) {
      const startStatus = this.props.isOpen ? 'start-opening' : 'start-closing';

      const initialPositionState = this.getInitialPositionState(startStatus);

      this.setState({
        position: initialPositionState,
        status: startStatus,
      });
    }

    // There are two "interim" statuses, that should only exist for a single
    // update cycle: 'shrunk' and 'teleported'. These are the "Inverted" part
    // of FLIP, and the one chosen will depend on whether the child is opening
    // or closing.
    if (status === 'start-opening' || status === 'start-closing') {
      this.playAnimation();
    }
  }

  getInitialPositionState(startStatus: StartStatus) {
    const { fromRect, toRect, childRect } = this.state;

    // TODO: is this just for FLow? Is it even necessary fo Flow? Figure it out
    if (!childRect) {
      return;
    }

    const isOpening = startStatus === 'start-opening';

    // We want to position the element relative to the relevant node.
    // For opening, this is the "from" node. For closing, this is the "to" node.
    const relativeRect = isOpening ? fromRect : toRect;

    // Flow fix?
    if (!relativeRect) {
      return;
    }

    const quadrant = this.getQuadrant(relativeRect);

    // TODO: Should the `quadrant` be computed from within this method?
    // is it used anywhere else?
    const minimumPositionData = this.getChildPosition(quadrant, relativeRect);

    // const [x, y] = getPositionDelta(oldChildRect, newChildRect);
    const pendingChildRect = createAugmentedClientRectFromMinimumData(
      minimumPositionData,
      childRect.width,
      childRect.height,
      this.props.windowWidth,
      this.props.windowHeight
    );

    const { translateX, translateY } = this.getTranslate(
      startStatus,
      pendingChildRect
    );

    return {
      ...minimumPositionData,
      translateX,
      translateY,
      transformOrigin: this.getTransformOrigin(startStatus, quadrant),
    };
  }

  // invertNode(nextStatus: Status) {
  //   const { windowWidth, windowHeight } = this.props;
  //   const { status, childRect: oldChildRect } = this.state;

  //   // Should be impossible, but Flow
  //   if (!oldChildRect) {
  //     throw new Error(
  //       'No oldChildRect found! Is `invertNode` being called somewhere unexpected?'
  //     );
  //   }

  //   window.requestAnimationFrame(() => {
  //     const newChildRect = createAugmentedClientRect(
  //       this.childWrapperNode,
  //       windowWidth,
  //       windowHeight
  //     );

  //     const [x, y] = getPositionDelta(oldChildRect, newChildRect);

  //     // TODO: Status-incrementer
  //     this.setState({ translateX: x, translateY: y, status: nextStatus });
  //   });
  // }

  playAnimation = () => {
    const { status } = this.state;
    const nextStatus = incrementStatus(status);

    this.setState({
      position: {
        ...this.state.position,
        translateX: 0,
        translateY: 0,
        scaleX: nextStatus === 'opening' ? 1 : 0,
        scaleY: nextStatus === 'opening' ? 1 : 0,
      },
      status: incrementStatus(status),
    });
  };

  finishPlaying = () => {
    // TODO: Use position since it'd be more accurate?
    const nextStatus = this.state.status === 'opening' ? 'open' : 'closed';

    this.setState({ status: nextStatus });
  };

  getAugmentedClientRects(props: Props = this.props) {
    const { from, to, windowWidth, windowHeight } = props;

    return {
      fromRect: createAugmentedClientRect(from, windowWidth, windowHeight),
      toRect: createAugmentedClientRect(to, windowWidth, windowHeight),
      childRect: createAugmentedClientRect(
        this.childWrapperNode,
        windowWidth,
        windowHeight
      ),
    };
  }

  getQuadrant(rect: ?AugmentedClientRect) {
    const { windowWidth, windowHeight } = this.props;

    if (!rect) {
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

    if (rect.centerY < windowCenter.y) {
      // top half, left or right
      return rect.centerX < windowCenter.x ? 1 : 2;
    } else {
      // bottom half, left or right
      return rect.centerX < windowCenter.x ? 3 : 4;
    }
  }

  getTranslate(
    startStatus: StartStatus,
    pendingChildRect: AugmentedClientRect
  ) {
    const { from, to } = this.props;
    const { childRect, fromRect, toRect } = this.state;

    // We don't have any translation on-open.
    // Might change this later, if we add padding support.
    if (startStatus === 'start-opening') {
      return { translateX: 0, translateY: 0 };
    }

    if (!fromRect || !toRect || !childRect) {
      throw new Error('Animation started without necessary rects!');
    }

    // If we're going "to" the target, we want to disappear into its center.
    // if (isClosing) {
    //   return {
    //     translateX: toRect.left + toRect.width / 2 - childRect.width / 2,
    //     translateY: toRect.top + toRect.height / 2 - childRect.height / 2,
    //   };
    // }

    // Ahh unfortunately complicated bit warning!
    // So, at this moment in time,
    const [translateX, translateY] = getPositionDelta(
      childRect,
      pendingChildRect
    );
    return { translateX, translateY };

    // Otherwise, the translate values will be based on the quadrant.
    switch (quadrant) {
      case 1:
        return {
          translateX: fromRect.right,
          translateY: fromRect.bottom,
        };
      case 2:
        return {
          translateX: fromRect.left - childRect.width,
          translateY: fromRect.bottom,
        };
      case 3:
        return {
          translateX: fromRect.right,
          translateY: fromRect.top,
        };
      case 4:
        return {
          translateX: fromRect.left,
          translateY: fromRect.top,
        };
      default:
        throw new Error(`Unrecognized quadrant: ${quadrant}`);
    }
  }

  getTransformOrigin(startStatus: Status, quadrant: Quadrant) {
    // If we're going "to" the target, we want to disappear into its center.
    // For this reason, the transform-origin will always be the middle.
    if (startStatus === 'start-closing') {
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

  getChildPosition(
    quadrant: Quadrant,
    targetRect: AugmentedClientRect
  ): MinimumFixedPosition {
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
    const { windowWidth, windowHeight } = this.props;
    const { status, childRect } = this.state;

    // NOTE: should be impossible, just for Flow.
    if (!childRect) {
      throw new Error("childRect doesn't exist");
    }

    // This is setting the initial position.
    // Therefore, if the current status is "closed", it means we're about to
    // open it, and vice-versa.
    const isOpening = status === 'closed' || status === 'closing';

    switch (quadrant) {
      case 1:
        return {
          top: isOpening
            ? targetRect.bottom
            : targetRect.centerY - childRect.height / 2,
          left: isOpening
            ? targetRect.right
            : targetRect.centerX - childRect.width / 2,
        };
      case 2:
        return {
          top: isOpening
            ? targetRect.bottom
            : targetRect.centerY - childRect.height / 2,
          right: isOpening
            ? targetRect.fromBottomRight.left
            : targetRect.fromBottomRight.centerX - childRect.width / 2,
        };
      case 3:
        return {
          bottom: isOpening
            ? targetRect.fromBottomRight.top
            : targetRect.fromBottomRight.centerY - childRect.height / 2,
          left: isOpening
            ? targetRect.right
            : targetRect.centerX - childRect.width / 2,
        };
      case 4:
        return {
          bottom: isOpening
            ? targetRect.fromBottomRight.top
            : targetRect.fromBottomRight.centerY - childRect.height / 2,
          right: isOpening
            ? targetRect.fromBottomRight.left
            : targetRect.fromBottomRight.centerX - childRect.width / 2,
        };
      default:
        throw new Error(`Unrecognized quadrant: ${quadrant}`);
    }
  }

  // getChildPosition() {
  //   const quadrant = this.getTargetQuadrant();

  //   const transformOrigin = this.getTransformOrigin(quadrant);

  //   let targetValues = {
  //     ...this.getChildPosition(quadrant),
  //     scaleX: 1,
  //     scaleY: 1,
  //   };
  //   switch (this.state.status) {
  //     case 'idle': {
  //       targetValues = {
  //         ...targetValues,
  //         translateX: 0,
  //         translateY: 0,
  //       };
  //       break;
  //     }
  //     case 'inverted': {
  //       targetValues = {
  //         ...targetValues,
  //         translateX: this.state.translateX,
  //         translateY: this.state.translateY,
  //         scaleX: this.props.direction === 'to' ? 1 : 0,
  //         scaleY: this.props.direction === 'to' ? 1 : 0,
  //       };
  //       break;
  //     }
  //     case 'playing': {
  //       targetValues = {
  //         ...targetValues,
  //         translateX: this.props.direction === 'to' ? spring(0) : 0,
  //         translateY: this.props.direction === 'to' ? spring(0) : 0,
  //         scaleX: spring(this.props.direction === 'to' ? 0 : 1),
  //         scaleY: spring(this.props.direction === 'to' ? 0 : 1),
  //       };
  //       break;
  //     }
  //   }
  // }

  render() {
    const { children } = this.props;
    const { status, position } = this.state;

    const {
      top,
      left,
      right,
      bottom,
      scaleX,
      scaleY,
      translateX,
      translateY,
      transformOrigin,
    } = position;

    const shouldSpringScale = ['opening', 'closing'].includes(status);
    const shouldSpringTransform = ['closing'].includes(status);

    return (
      <Motion
        defaultStyle={{
          scaleX: 1,
          scaleY: 1,
          // translateX: target.left,
          // translateY: target.top,
        }}
        style={{
          scaleX: shouldSpringScale ? spring(scaleX) : scaleX,
          scaleY: shouldSpringScale ? spring(scaleY) : scaleY,
          translateX: shouldSpringTransform ? spring(translateX) : translateX,
          translateY: shouldSpringTransform ? spring(translateY) : translateY,
        }}
        onRest={this.finishPlaying}
      >
        {({ scaleX, scaleY, translateX, translateY }) => (
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
  position: fixed;
`;

export default ChildTraveller;
