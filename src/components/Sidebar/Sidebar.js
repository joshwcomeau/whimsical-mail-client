import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import SidebarHeader from '../SidebarHeader';
import EmailList from '../EmailList';

class Sidebar extends Component {
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
          <EmailList itemHeight={itemHeight} />
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
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.gray[100]};
`;

const MailList = styled.div`
  position: relative;
  z-index: 1;
`;

const MailListActiveBackground = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  height: ${props => props.height}px;
  width: 100%;
  background: white;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  transform: translateY(${props => props.height * props.position}px);
  transition: transform ${props => props.position * 200 + 200}ms;
`;

export default Sidebar;
