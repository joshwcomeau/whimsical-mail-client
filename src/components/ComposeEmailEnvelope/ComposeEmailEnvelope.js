// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import airMailSrc from '../../assets/air-mail.png';
import { parseEmailString } from '../../helpers/email.helpers';

import type { UserData } from '../../types';

type Props = {
  toEmail: $Shape<UserData>,
  subject: string,
};

class ComposeEmailEnvelope extends Component<Props> {
  render() {
    const { subject, toEmail } = this.props;

    const { email } = parseEmailString(toEmail);

    return (
      <Wrapper aria-hidden="true">
        <AirMailBorder />
        <InnerContents>
          <Subject>{subject}</Subject>
          <To>{email}</To>
        </InnerContents>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const AirMailBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: url(${airMailSrc});
  background-size: 64px;
`;

const InnerContents = styled.div`
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Subject = styled.div`
  max-width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
  font-size: 15px;
  font-weight: bold;
`;

const To = styled.div`
  font-size: 15px;
  opacity: 0.8;
`;

export default ComposeEmailEnvelope;
