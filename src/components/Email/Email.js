// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';

import { COLORS } from '../../constants';

import type { EmailData } from '../../types';

type Props = {
  data: EmailData,
};

class Email extends Component<Props> {
  render() {
    const { subject, to, from, timestamp, body } = this.props.data;

    const formattedBody = body
      .split('\n')
      .map((paragraph, index) => (
        <Paragraph key={index}>{paragraph}</Paragraph>
      ));

    const formattedFrom = from.name || from.email;
    const formattedTo = to.name || to.email;

    return (
      <Wrapper>
        <Header>
          <Addresses>
            {formattedFrom} → {formattedTo}
          </Addresses>
          <Subject>{subject}</Subject>
          <Timestamp>{format(timestamp, 'MMM Do, YYYY [at] h:mm A')}</Timestamp>
        </Header>

        <Body>{formattedBody}</Body>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 70px 50px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
`;

const Addresses = styled.div`
  color: ${COLORS.gray[400]};
  font-size: 13px;
  margin-bottom: 14px;
`;

const Subject = styled.h1`
  font-size: 28px;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  margin: auto;
  margin-bottom: 16px;
  max-width: 600px;
`;

const Timestamp = styled.div`
  color: ${COLORS.gray[400]};
  font-size: 14px;
`;

const Body = styled.div`
  margin-top: 70px;
`;

const Paragraph = styled.p`
  font-size: 18px;
  line-height: 1.65;
  margin-bottom: 30px;
`;

export default Email;
