// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  height: number,
};

class SidebarHeader extends Component<Props> {
  render() {
    const { height } = this.props;

    return (
      <Wrapper height={height}>
        <InnerWrapper>
          <SidebarHeaderLink isSelected={true}>Inbox</SidebarHeaderLink>
          <SidebarHeaderLink isSelected={false}>Outbox</SidebarHeaderLink>
          <SidebarHeaderLink isSelected={false}>Drafts</SidebarHeaderLink>
        </InnerWrapper>
      </Wrapper>
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
  max-width: 300px;
  padding-left: 24px;
  font-size: 24px;
`;

const SidebarHeaderLink = styled.h2`
  font-weight: 700;
  opacity: ${props => (props.isSelected ? 1 : 0.5)};
  cursor: pointer;
`;

export default SidebarHeader;
