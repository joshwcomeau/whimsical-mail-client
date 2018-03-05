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
            <EmailWrapper>
              <Email data={selectedEmail} />
            </EmailWrapper>
          )}
        </EmailConsumer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const EmailWrapper = styled.div`
  max-width: 840px;
  margin: 0 auto;
  padding: 0 20px;
`;

export default MainPane;
