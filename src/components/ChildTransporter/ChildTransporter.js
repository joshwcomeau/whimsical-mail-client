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

type Quadrant = 1 | 2 | 3 | 4;

export type StartStatus =
  | 'start-opening'
  | 'start-closing'
  | 'start-retracting';
export type TransitionStatus = 'opening' | 'closing' | 'retracting';
export type EndStatus = 'open' | 'closed' | 'retracted';
export type Status = StartStatus | TransitionStatus | EndStatus;

type SpringSettings = {
  stiffness?: number,
  damping?: number,
  precision?: number,
};

type Props = {
  children: React$Node,
  from: HTMLElement,
  to: HTMLElement,
  status: EndStatus,
  springOpenHorizontal: SpringSettings,
  springOpenVertical: SpringSettings,
  springCloseHorizontal: SpringSettings,
  springCloseVertical: SpringSettings,
  windowWidth: number,
  windowHeight: number,
  handleFinishTransportation?: (status: EndStatus) => any,
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
  static defaultProps = {
    springOpenHorizontal: { stiffness: 150, damping: 20 },
    springOpenVertical: { stiffness: 200, damping: 20 },
    springCloseHorizontal: { stiffness: 150, damping: 22 },
    springCloseVertical: { stiffness: 150, damping: 22 },
  };

  childWrapperNode: HTMLElement;

  state = {
    fromRect: null,
    toRect: null,
    childRect: null,
    status: this.props.status,
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

    if (this.props.status !== nextProps.status) {
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
    const wasJustToggled = prevProps.status !== this.props.status;

    // TODO: This should probably move to cWRP, so that the whole cycle isn't
    // required right?
    if (wasJustToggled) {
      let startStatus;
      if (this.props.status === 'open') {
        startStatus = 'start-opening';
      } else if (this.props.status === 'closed') {
        startStatus = 'start-closing';
      } else {
        startStatus = 'start-retracting';
      }

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
    if (
      status === 'start-opening' ||
      status === 'start-closing' ||
      status === 'start-retracting'
    ) {
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
    const relativeRect = startStatus === 'start-closing' ? toRect : fromRect;

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
    const minimumPositionData = this.getChildPosition(
      quadrant,
      relativeRect,
      startStatus
    );

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
    } else if (status === 'start-retracting') {
      nextStatus = 'retracting';
    } else {
      throw new Error('`playAnimation` called at an invalid moment in time');
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
    const { status } = this.state;

    let restingStatus;
    if (status === 'opening') {
      restingStatus = 'open';
    } else if (status === 'closing') {
      restingStatus = 'closed';
    } else if (status === 'retracting') {
      restingStatus = 'retracted';
    } else {
      // ReactMotion is in charge of calling this method, and it appears that
      // it calls it on mount, when the status is `closed`. Just ignore this
      // case.
      return;
    }

    this.setState({ status: restingStatus });

    if (typeof this.props.handleFinishTransportation === 'function') {
      this.props.handleFinishTransportation(restingStatus);
    }
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
    if (startStatus === 'start-opening' || startStatus === 'start-retracting') {
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
    targetRect: AugmentedClientRect,
    startStatus: StartStatus
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
    const { childRect } = this.state;

    if (!childRect) {
      throw new Error("childRect doesn't exist");
    }

    const orientRelativeToCorner =
      startStatus === 'start-opening' || startStatus === 'start-retracting';

    switch (quadrant) {
      case 1:
        return {
          top: orientRelativeToCorner
            ? targetRect.bottom
            : targetRect.centerY - childRect.height / 2,
          left: orientRelativeToCorner
            ? targetRect.right
            : targetRect.centerX - childRect.width / 2,
        };
      case 2:
        return {
          top: orientRelativeToCorner
            ? targetRect.bottom
            : targetRect.centerY - childRect.height / 2,
          right: orientRelativeToCorner
            ? targetRect.fromBottomRight.left
            : targetRect.fromBottomRight.centerX - childRect.width / 2,
        };
      case 3:
        return {
          bottom: orientRelativeToCorner
            ? targetRect.fromBottomRight.top
            : targetRect.fromBottomRight.centerY - childRect.height / 2,
          left: orientRelativeToCorner
            ? targetRect.right
            : targetRect.centerX - childRect.width / 2,
        };
      case 4:
        return {
          bottom: orientRelativeToCorner
            ? targetRect.fromBottomRight.top
            : targetRect.fromBottomRight.centerY - childRect.height / 2,
          right: orientRelativeToCorner
            ? targetRect.fromBottomRight.left
            : targetRect.fromBottomRight.centerX - childRect.width / 2,
        };
      default:
        throw new Error(`Unrecognized quadrant: ${quadrant}`);
    }
  }

  render() {
    const {
      from,
      to,
      children,
      springOpenHorizontal,
      springOpenVertical,
      springCloseHorizontal,
      springCloseVertical,
    } = this.props;
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

    const shouldSpringScale = ['opening', 'closing', 'retracting'].includes(
      status
    );
    const shouldSpringTransform = ['closing'].includes(status);

    const springHorizontal =
      status === 'closing' ? springCloseHorizontal : springOpenHorizontal;
    const springVertical =
      status === 'closing' ? springCloseVertical : springOpenVertical;

    return (
      <Motion
        defaultStyle={{
          scaleX: 1,
          scaleY: 1,
        }}
        style={{
          scaleX: shouldSpringScale ? spring(scaleX, springHorizontal) : scaleX,
          scaleY: shouldSpringScale ? spring(scaleY, springVertical) : scaleY,
          translateX: shouldSpringTransform
            ? spring(translateX, springHorizontal)
            : translateX,
          translateY: shouldSpringTransform
            ? spring(translateY, springVertical)
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
                scale(${Math.max(scaleX, 0)}, ${Math.max(scaleY, 0)})
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
