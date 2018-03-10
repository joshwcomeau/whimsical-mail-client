// @flow
import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';

import Avatar from '../Avatar';
import Spacer from '../Spacer';

import type { EmailData } from '../../types';

type Props = {
  data: EmailData,
  height: number,
  isSelected: boolean,
  handleClick: () => void,
};
const EmailPreview = ({ data, height, isSelected, handleClick }: Props) => {
  return (
    <Wrapper height={height} isSelected={isSelected} onClick={handleClick}>
      <Avatar size={50} src={data.from.avatarSrc} />
      <Spacer size={10} />
      <Summary>
        <Header>
          <From>{data.from.name}</From>
          <At>{format(data.timestamp, 'H:mm a')}</At>
        </Header>

        <Subject>{data.subject}</Subject>
        <Preview>{data.preview}</Preview>
      </Summary>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 18px 0;
  height: ${props => props.height + 'px'};
  display: flex;
  align-items: center;
  line-height: 1.6;
  transition: opacity 500ms;
  cursor: pointer;
`;

const Summary = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
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

export default EmailPreview;
