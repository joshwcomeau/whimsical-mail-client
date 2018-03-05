import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../Header';
import Letter from '../Letter';
import { MailConsumer } from '../MailProvider';

class MainPane extends Component {
  render() {
    const { headerHeight } = this.props;

    return (
      <Wrapper>
        <Header height={headerHeight} />

        <MailConsumer>
          {({ selectedLetter }) => (
            <LetterWrapper>
              <Letter letter={selectedLetter} />
            </LetterWrapper>
          )}
        </MailConsumer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const LetterWrapper = styled.div`
  max-width: 840px;
  margin: 0 auto;
  padding: 0 20px;
`;

export default MainPane;
