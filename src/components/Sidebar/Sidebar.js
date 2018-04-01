// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import SidebarHeader from '../SidebarHeader';
import Search from '../Search';
import EmailList from '../EmailList';
import Spacer from '../Spacer';

import type { BoxId } from '../../types';

type Props = {
  width: number,
  itemHeight: number,
  headerHeight: number,
};

class Sidebar extends Component<Props> {
  static defaultProps = {
    width: 400,
    itemHeight: 100,
    headerHeight: 50,
  };

  render() {
    const { width, itemHeight, headerHeight } = this.props;

    return (
      <Wrapper width={width}>
        <Foreground>
          <SidebarHeader height={headerHeight} />
          <EmailListWrapper headerHeight={headerHeight}>
            <Search />
            <Spacer size={10} />
            <EmailList itemHeight={itemHeight} />
          </EmailListWrapper>
        </Foreground>

        <Background />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const Foreground = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.gray[100]};
`;

const EmailListWrapper = styled.div`
  height: calc(100% - ${({ headerHeight }) => headerHeight}px);
  padding: 24px;
  overflow: scroll;
`;

export default Sidebar;
