// @flow
import React from 'react';
import styled from 'styled-components';

const MailListItem = ({ email }) => {
  return (
    <Wrapper>
      <img src={email.from.avatarSrc} />
      {email.subject}
      <br />
      <br />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 1rem;
`;

export default MailListItem;
