// @flow
/**
 * NOTE: Doesn't do anything. Just for show :)
 */
import React from 'react';
import styled from 'styled-components';
import SearchIcon from 'react-icons/lib/md/search';

import { COLORS } from '../../constants';

type Props = { height: number };

const Search = ({ height = 36 }: Props) => (
  <Wrapper height={height}>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>

    <Input placeholder="Search" />
  </Wrapper>
);

const Wrapper = styled.label`
  display: flex;
  position: relative;
  height: ${props => props.height}px;
  background: white;
  border-radius: ${props => props.height / 2}px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const SearchIconWrapper = styled.div`
  width: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${COLORS.gray[500]};
`;

const Input = styled.input`
  flex: 1;
  display: flex;
  height: 100%;
  background: transparent;
  border: none;
  font-size: 14px;
  padding-left: 8px;
  /* Optical centering */
  transform: translateY(-1px);

  outline: none;

  &::placeholder {
    opacity: 0.5;
  }
`;

export default Search;
