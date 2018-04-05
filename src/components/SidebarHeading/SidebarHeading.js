// @flow
import React from 'react';
import styled from 'styled-components';

import { capitalize } from '../../utils';

import { NodeConsumer } from '../NodeProvider';

import type { BoxId } from '../../types';

type Props = {
  boxId: string,
  height: number,
  isSelected: boolean,
  handleClick: (box: BoxId) => void,
};

const SidebarHeading = ({ boxId, height, isSelected, handleClick }: Props) => (
  <NodeConsumer>
    {({ refCapturer }) => (
      <SidebarHeaderBox
        innerRef={node => refCapturer(boxId, node)}
        height={height}
        isSelected={isSelected}
        onClick={handleClick}
      >
        {capitalize(boxId)}
      </SidebarHeaderBox>
    )}
  </NodeConsumer>
);

const SidebarHeaderBox = styled.button`
  display: block;
  position: relative;
  height: ${props => props.height}px;
  background: transparent;
  border: none;
  font-weight: 500;
  font-size: 16px;
  opacity: ${props => (props.isSelected ? 1 : 0.35)};
  transition: opacity 500ms;
  cursor: pointer;
  outline: none;
`;

export default SidebarHeading;
