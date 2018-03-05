// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { EmailConsumer } from '../EmailProvider';
import EmailPreview from '../EmailPreview';

type Props = {
  itemHeight: number,
};

class EmailList extends Component<Props> {
  render() {
    const { itemHeight } = this.props;

    return (
      <EmailConsumer>
        {({ emailList, selectedEmailId, viewEmail }) => (
          <Wrapper>
            {emailList.map(email => (
              <EmailPreview
                key={email.id}
                data={email}
                height={itemHeight}
                isSelected={email.id === selectedEmailId}
                handleClick={() => viewEmail(email.id)}
              />
            ))}
          </Wrapper>
        )}
      </EmailConsumer>
    );
  }
}

const Wrapper = styled.div``;

export default EmailList;
