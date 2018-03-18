// @flow
/**
 * This utility component can make its children appear from (or disappear to)
 * a given target HTMLElement.
 */
import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { isEmpty } from '../../utils';

import {
  getPositionDelta,
  createAugmentedClientRect,
  createAugmentedClientRectFromMinimumData,
} from './ChildTransporter.helpers';
import type {
  AugmentedClientRect,
  MinimumFixedPosition,
} from './ChildTransporter.types';

const fastSpring = { stiffness: 150, damping: 20 };
const slowSpring = { stiffness: 200, damping: 20 };

type Quadrant = 1 | 2 | 3 | 4;

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
    top: ?number,
    left: ?number,
    right: ?number,
    bottom: ?number,
    translateX: number,
    translateY: number,
    scaleX: number,
    scaleY: number,
    transformOrigin: ?string,
  },
};

class ChildTransporter extends Component<Props, State> {
  childWrapperNode: HTMLElement;

  state = {
    fromRect: null,
    toRect: null,
    childRect: null,
    status: 'closed', // TODO depend on props.isOpen
    position: {
      top: null,
      left: null,
      right: null,
      bottom: null,
      scaleX: 0,
      scaleY: 0,
      translateX: 0,
      translateY: 0,
      transformOrigin: null,
    },
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.from || !nextProps.to || !this.childWrapperNode) {
      return;
    }

    // If the `isOpen` status changes, we need to recapture our boxes.
    // NOTE: We're assuming that all available nodes are available when
    // we reach this step.
    if (this.props.isOpen !== nextProps.isOpen) {
      const { fromRect, toRect, childRect } = this.getAugmentedClientRects(
        nextProps
      );

      this.setState({ fromRect, toRect, childRect });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!this.props.from || !this.props.to || !this.childWrapperNode) {
      return;
    }
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

    if (!fromRect || !toRect || !childRect) {
      throw new Error('Tried to get position without necessary rects!');
    }

    // We want to position the element relative to the relevant node.
    // For opening, this is the "from" node. For closing, this is the "to" node.
    const relativeRect = startStatus === 'start-opening' ? fromRect : toRect;

    // Figure out which of the 4 quarters of the screen our child is moving
    // to or from.
    const quadrant: Quadrant = this.getQuadrant(relativeRect);

    // The `transform-origin` of our child during transit.
    const transformOrigin = this.getTransformOrigin(quadrant, startStatus);

    // The "minimum position" is what we need to know for our child's new home.
    // Consists of either a `top` or a `down`, and a `left` or a `right`.
    // Unlike ClientRect, these are the values in `position: fixed` terms, and
    // so the `right` value is the number of pixels between the element and the
    // right edge of the viewport.
    const minimumPositionData = this.getChildPosition(quadrant, relativeRect);

    // Because our animations use CSS transforms, we need to convert our
    // fixed-position coords into an AugmentedClientRect
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
      scaleX: this.state.position.scaleX,
      scaleY: this.state.position.scaleY,
      transformOrigin,
    };
  }

  playAnimation = () => {
    const { status } = this.state;

    let nextStatus;
    if (status === 'start-opening') {
      nextStatus = 'opening';
    } else if (status === 'start-closing') {
      nextStatus = 'closing';
    } else {
      throw new Error('`playAnimation` called at an unexpected time.');
    }

    this.setState({
      status: nextStatus,
      position: {
        ...this.state.position,
        translateX: 0,
        translateY: 0,
        scaleX: nextStatus === 'opening' ? 1 : 0,
        scaleY: nextStatus === 'opening' ? 1 : 0,
      },
    });
  };

  finishPlaying = () => {
    // TODO: Use position since it'd be more accurate?
    const nextStatus = this.state.status === 'opening' ? 'open' : 'closed';

    this.setState({ status: nextStatus });
  };

  getAugmentedClientRects(props: Props = this.props) {
    /**
     * For our calculations, we care about 3 on-screen positions:
     *  - The `from` node
     *  - The `to` node
     *  - The child node (which will be positioned _near_ one of the above 2
     *    nodes, but which has its own coordinates).
     *
     * This method creates "augmented" client rects for them.
     * An AugmentedClientRect is similar to the ClientRect produced by
     * getBoundingClientRect, but features a couple extra data points.
     * For more info, see ChildTransporter.types.js
     */
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

  getQuadrant(targetRect: ?AugmentedClientRect): Quadrant {
    const { windowWidth, windowHeight } = this.props;

    // When expanding from something, we want to use its "opposite" corner.
    // Imagine we divide the screen into quadrants:
    //  ___________
    // |  1  |  2  |
    // |-----|-----|
    // |  3  |  4  |
    // ------------
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

    if (!targetRect) {
      throw new Error('Could not calculate quadrant, no targetRect given');
    }

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

  getTranslate(
    startStatus: StartStatus,
    pendingChildRect: AugmentedClientRect
  ) {
    /**
     * This component uses the FLIP technique.
     *
     * When our open status changes, we move the node using fixed positioning
     * to the `to` node, and then we "invert" that effect by applying an
     * immediate, opposite translation.
     *
     * This method calculates that by comparing the child rect held in state
     * with the "pending" childRect, which is about to be applied.
     */
    const { childRect: currentChildRect } = this.state;

    if (!currentChildRect) {
      throw new Error('Animation started without necessary childRect!');
    }

    // We don't have any translation on-open.
    // Might change this later, if we add spacing support.
    if (startStatus === 'start-opening') {
      return { translateX: 0, translateY: 0 };
    }

    const [x, y] = getPositionDelta(currentChildRect, pendingChildRect);
    return { translateX: x, translateY: y };
  }

  getTransformOrigin(quadrant: Quadrant, startStatus: Status) {
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
     * Get the fixed position for the child, calculated using the target rect
     * for reference.
     *
     * This depends on two factors:
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
     * 2. STATUS
     *     When about to 'open' the child, we want to align the child with the
     *     target's opposite corner (as shown in 1. QUADRANT).
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
     *     This has to do with the intended effect: the child should grow from
     *     the target's corner, but it should shrink into the target's center.
     */
    const { windowWidth, windowHeight } = this.props;
    const { status, childRect } = this.state;

    if (!childRect) {
      throw new Error("childRect doesn't exist");
    }

    // This is setting the initial position.
    // Therefore, if the current status is "closed", it means we're about to
    // open it, and vice-versa.
    // If we interrupt it, the status will be "closing" instead of "closed",
    // but we want to treat it the same way.
    // TODO: Nicer interrupt-handling.
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

  render() {
    const { from, to, children } = this.props;
    const { status, position } = this.state;

    if (!from || !to) {
      return null;
    }

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
        }}
        style={{
          scaleX: shouldSpringScale ? spring(scaleX, fastSpring) : scaleX,
          scaleY: shouldSpringScale ? spring(scaleY, slowSpring) : scaleY,
          translateX: shouldSpringTransform
            ? spring(translateX, fastSpring)
            : translateX,
          translateY: shouldSpringTransform
            ? spring(translateY, slowSpring)
            : translateY,
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
  z-index: 10000;
`;

export default ChildTransporter;
