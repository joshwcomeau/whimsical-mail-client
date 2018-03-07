// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { capitalize } from '../../utils';

import { NodeConsumer } from '../NodeProvider';

import type { Box } from '../../types';

type Props = {
  height: number,
  selectedBox: Box,
  handleSelectBox: (box: Box) => void,
};

class SidebarHeader extends Component<Props> {
  render() {
    const { height, selectedBox, handleSelectBox } = this.props;

    const boxes: Array<Box> = ['inbox', 'outbox', 'drafts'];

    return (
      <NodeConsumer>
        {({ refs, refCapturer }) => (
          <Wrapper height={height}>
            <InnerWrapper>
              {boxes.map(box => (
                <SidebarHeaderLink
                  isSelected={selectedBox === box}
                  onClick={() => handleSelectBox(box)}
                >
                  {capitalize(box)}
                </SidebarHeaderLink>
              ))}
            </InnerWrapper>
          </Wrapper>
        )}
      </NodeConsumer>
    );
  }
}

const Wrapper = styled.div`
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  background: white;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 270px;
  padding-left: 24px;
  font-size: 16px;
`;

const SidebarHeaderLink = styled.h2`
  position: relative;
  font-weight: 500;
  opacity: ${props => (props.isSelected ? 1 : 0.35)};
  cursor: pointer;

  &:after {
    content: '';
    width: 100%;
    height: 3px;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: ${props => (props.isSelected ? 1 : 0)};
    background-color: #f4108f;
  }
`;

export default SidebarHeader;
