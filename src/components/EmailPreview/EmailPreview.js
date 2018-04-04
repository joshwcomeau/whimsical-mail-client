// @flow
import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import isSameDay from 'date-fns/is_same_day';

import { COLORS } from '../../constants';

import Avatar from '../Avatar';
import Spacer from '../Spacer';

import type { EmailData, BoxId } from '../../types';

const formatTime = timestamp => {
  if (isSameDay(timestamp, new Date())) {
    return format(timestamp, 'h:mm a');
  }

  return format(timestamp, 'MMM Do');
};

type Props = {
  data: EmailData,
  selectedBoxId: BoxId,
  height: number,
  isSelected: boolean,
  handleClick: () => void,
};
const EmailPreview = ({
  data,
  selectedBoxId,
  height,
  isSelected,
  handleClick,
}: Props) => {
  const user = selectedBoxId === 'inbox' ? data.from : data.to;

  return (
    <Wrapper height={height} isSelected={isSelected} onClick={handleClick}>
      <UnreadDot size={6} visible={data.unread} />
      <Avatar size={50} src={user.avatarSrc} />
      <Spacer size={10} />
      <Summary>
        <Header>
          <From>{user.name}</From>
          <At>{formatTime(data.timestamp)}</At>
        </Header>

        <Subject unread={data.unread}>{data.subject}</Subject>
        <Preview>{data.body}</Preview>
      </Summary>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  padding: 18px 24px;
  height: ${props => props.height + 'px'};
  background-color: ${props => props.isSelected && COLORS.blue[700]};
  color: ${props => props.isSelected && '#FFF'};
  display: flex;
  align-items: center;
  line-height: 1.6;
  transition: opacity 500ms;
  cursor: pointer;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 0;
  left: ${props => 12 - props.size / 2}px;
  bottom: 0;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${COLORS.pink[500]};
  border-radius: 100%;
  opacity: ${props => (props.visible ? 1 : 0)};
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
  opacity: 0.9;
  font-weight: 400;
`;

const From = styled.div``;
const At = styled.div``;

const Subject = styled.h4`
  font-weight: ${props => (props.unread ? 700 : 500)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Preview = styled.p`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 300;
  opacity: 0.85;
`;

export default EmailPreview;
