// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import Providers from '../Providers';
import { ModalConsumer } from '../ModalProvider';
import { NodeConsumer } from '../NodeProvider';
import Sidebar from '../Sidebar';
import MainPane from '../MainPane';
import ComposeEmailContainer from '../ComposeEmailContainer';

type Props = {};

class App extends Component<Props> {
  render() {
    const HEADER_HEIGHT = 60;

    return (
      <Providers>
        <Wrapper>
          <SidebarWrapper>
            <Sidebar headerHeight={HEADER_HEIGHT} />
          </SidebarWrapper>
          <MainPaneWrapper>
            <MainPane headerHeight={HEADER_HEIGHT} />
          </MainPaneWrapper>
        </Wrapper>

        <ModalConsumer>
          {({ currentModal, openFromNode, closeModal }) => (
            <ComposeEmailContainer
              handleClose={closeModal}
              isOpen={currentModal === 'compose'}
            />
          )}
        </ModalConsumer>
      </Providers>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const SidebarWrapper = styled.div`
  position: relative;
  height: 100%;
  z-index: 1;
`;

const MainPaneWrapper = styled.div`
  position: relative;
  height: 100%;
  background: white;
  flex: 1;
  z-index: 2;
`;

export default App;
