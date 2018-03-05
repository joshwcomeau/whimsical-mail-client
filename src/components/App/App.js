// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import EmailProvider from '../EmailProvider';
import Sidebar from '../Sidebar';
import MainPane from '../MainPane';

type Props = {};

class App extends Component<Props> {
  render() {
    const HEADER_HEIGHT = 80;

    return (
      <EmailProvider>
        <Wrapper>
          <SidebarWrapper>
            <Sidebar headerHeight={HEADER_HEIGHT} />
          </SidebarWrapper>
          <MainPaneWrapper>
            <MainPane headerHeight={HEADER_HEIGHT} />
          </MainPaneWrapper>
        </Wrapper>
      </EmailProvider>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const MainPaneWrapper = styled.div`
  position: relative;
  background: white;
  flex: 1;
  z-index: 2;
`;

export default App;
