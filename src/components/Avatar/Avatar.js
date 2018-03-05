// @flow
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  src: string,
  size: number,
};
const Avatar = ({ src, size }: Props) => {
  return (
    <Wrapper size={size}>
      <AvatarImg src={src} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${COLORS.gray[300]};
  border-radius: 50%;
`;
const AvatarImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export default Avatar;
