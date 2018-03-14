// @flow
import { hyphenate } from '../../utils';

import type { AugmentedClientRect, Styles } from './ChildTraveller.types';

export const applyStylesToDOMNode = (domNode: HTMLElement, styles: Styles) => {
  // Can't just do an object merge because domNode.styles is no regular object.
  // Need to do it this way for the engine to fire its `set` listeners.
  Object.keys(styles).forEach(key => {
    domNode.style.setProperty(hyphenate(key), styles[key]);
  });
};

// Calculate the distance in pixels between two ClientRects
// prettier-ignore
export const getPositionDelta = (
  oldRect: AugmentedClientRect,
  newRect: AugmentedClientRect
) => [
  oldRect.left - newRect.left, 
  oldRect.top - newRect.top
];
