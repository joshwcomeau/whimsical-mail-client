// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import distanceInWords from 'date-fns/distance_in_words';

import { COLORS } from '../../constants';

import type { EmailData } from '../../types';

type Props = {
  data: EmailData,
};

class Email extends Component<Props> {
  render() {
    const { subject, from, timestamp, body } = this.props.data;

    return (
      <Wrapper>
        <Header>
          <From>
            {from.name}. {from.email}
          </From>
          <Subject>{subject}</Subject>
          <Timestamp>{distanceInWords(timestamp)}</Timestamp>
        </Header>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
`;

const From = styled.div`
  color: ${COLORS.gray[300]};
  font-size: 14px;
`;

const Subject = styled.h1`
  font-size: 28px;
  font-weight: bold;
`;

const Timestamp = styled.div`
  color: ${COLORS.gray[300]};
  font-size: 14px;
`;

export default Email;
