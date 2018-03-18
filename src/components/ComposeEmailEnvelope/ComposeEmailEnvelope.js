// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import airMailSrc from '../../assets/air-mail.png';

type Props = {
  from: string,
  to: string,
  subject: string,
};

class ComposeEmailEnvelope extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <AirMailBorder />
        <InnerContents>Hello World</InnerContents>
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
  justify-content: center;
  align-items: center;
`;

export default ComposeEmailEnvelope;
