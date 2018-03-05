// @flow
import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';

import Avatar from '../Avatar';
import Spacer from '../Spacer';

const MailListItem = ({ letter, height, isSelected, handleClick }) => {
  return (
    <Wrapper height={height} isSelected={isSelected} onClick={handleClick}>
      <Avatar size={50} src={letter.from.avatarSrc} />
      <Spacer size={10} />
      <Summary>
        <Header>
          <From>{letter.from.name}</From>
          <At>{format(letter.timestamp, 'H:mm a')}</At>
        </Header>

        <Subject>{letter.subject}</Subject>
        <Preview>{letter.preview}</Preview>
      </Summary>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px 16px;
  height: ${props => props.height + 'px'};
  display: flex;
  align-items: center;
  line-height: 1.6;
  /* opacity: ${props => (props.isSelected ? 1 : 0.7)}; */
  transition: opacity 500ms;
  cursor: pointer;
`;

const Summary = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  /** CSS HACK: 
   * min-width is necessary for the children's overflow ellipsis to work.
   * See: https://css-tricks.com/flexbox-truncated-text/
   */
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: #222;
  font-weight: 500;
`;

const From = styled.div``;
const At = styled.div``;

const Subject = styled.h4`
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Preview = styled.p`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 200;
  color: #666;
`;

export default MailListItem;
