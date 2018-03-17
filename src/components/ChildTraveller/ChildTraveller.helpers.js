// @flow
import { hyphenate } from '../../utils';

import type {
  AugmentedClientRect,
  MinimumFixedPosition,
} from './ChildTraveller.types';

// Calculate the distance in pixels between two ClientRects
// prettier-ignore
export const getPositionDelta = (
  oldRect: AugmentedClientRect,
  newRect: AugmentedClientRect
) => [
  oldRect.left - newRect.left, 
  oldRect.top - newRect.top
];

export const createAugmentedClientRect = (
  input: HTMLElement | ClientRect,
  windowWidth: number,
  windowHeight: number
): AugmentedClientRect => {
  // prettier-ignore
  // We support either an HTMLElement or a ClientRect as input.
  // This is easy since a ClientRect can easily be derived from an HTML
  // element:
  const rect = input instanceof HTMLElement 
    ? input.getBoundingClientRect() 
    : input;

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

export const createAugmentedClientRectFromMinimumData = (
  data: MinimumFixedPosition,
  childWidth: number,
  childHeight: number,
  windowWidth: number,
  windowHeight: number
) => {
  /**
   * During the initial position calculation, we figure out where our
   * child needs to move to, but for brevity, we only get the minimum
   * position necessary (either `top`/`bottom`, either `left`/`right`).
   * Later, when trying to apply the inverse translation in the FLIP step,
   * we'll need a proper AugmentedClientRect to do the translation calcs.
   * This method bridges that gap and derives the needed position data.
   */

  if (data.top == null && data.bottom == null) {
    throw new Error(
      'Cannot calculate AugmentedClientRect without either top or bottom'
    );
  }
  if (data.left == null && data.right == null) {
    throw new Error(
      'Cannot calculate AugmentedClientRect without either top or bottom'
    );
  }

  const top =
    typeof data.top === 'number'
      ? data.top
      : windowHeight - data.bottom - childHeight;
  const left =
    typeof data.left === 'number'
      ? data.left
      : windowWidth - data.right - childWidth;

  // The data values are in fixed positioning terms;
  // this means that `right` and `bottom` are the distance from that side of
  // the viewport.
  // We're creating an AugmentedClientRect, which looks at the distance from
  // the top/left of the viewport to the bottom/right edge of the element.
  const right =
    typeof data.right === 'number'
      ? windowWidth - data.right
      : windowWidth - data.left - childWidth;
  const bottom =
    typeof data.bottom === 'number'
      ? windowHeight - data.bottom
      : windowHeight - data.top - childHeight;

  return createAugmentedClientRect({
    top,
    left,
    right,
    bottom,
    width: childWidth,
    height: childHeight,
    x: left,
    y: top,
  });
};
