import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../Header';
import Email from '../Email';
import { EmailConsumer } from '../EmailProvider';

class MainPane extends Component {
  render() {
    const { headerHeight } = this.props;

    return (
      <Wrapper>
        <Header height={headerHeight} />

        <EmailConsumer>
          {({ selectedEmail }) => (
            <EmailWrapper headerHeight={headerHeight}>
              <Email data={selectedEmail} />
            </EmailWrapper>
          )}
        </EmailConsumer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EmailWrapper = styled.div`
  height: calc(100% - ${({ headerHeight }) => headerHeight}px);
  overflow-y: auto;
`;

export default MainPane;
