// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { EmailConsumer } from '../EmailProvider';
import EmailPreview from '../EmailPreview';

import type { BoxId } from '../../types';

type Props = {
  itemHeight: number,
  selectedBoxId: BoxId,
};

class EmailList extends Component<Props> {
  render() {
    const { itemHeight, selectedBoxId } = this.props;

    return (
      <EmailConsumer>
        {({ emailList, selectedEmailId, viewEmail }) => (
          <Wrapper>
            {emailList.map(email => (
              <EmailPreview
                key={email.id}
                selectedBoxId={selectedBoxId}
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
