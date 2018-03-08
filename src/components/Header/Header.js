// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import ReplyIcon from 'react-icons/lib/md/reply';
import ReplyAllIcon from 'react-icons/lib/md/reply-all';
import ForwardIcon from 'react-icons/lib/md/forward';
import DeleteIcon from 'react-icons/lib/md/delete';

import { COLORS } from '../../constants';

import Button from '../Button';
import ComposeButton from '../ComposeButton';

type Props = {
  height: number,
};

class Header extends Component<Props> {
  render() {
    const { height } = this.props;

    return (
      <Wrapper height={height}>
        <Side>
          <ButtonGroup>
            <Button secondary>
              <ReplyIcon />
            </Button>
            <Button secondary>
              <ReplyAllIcon />
            </Button>
            <Button secondary>
              <ForwardIcon />
            </Button>
          </ButtonGroup>
          <Separator height={height} />
          <ButtonGroup>
            <Button secondary>
              <DeleteIcon />
            </Button>
          </ButtonGroup>
        </Side>

        <Side>
          <ComposeButton />
        </Side>
      </Wrapper>
    );
  }
}

const Wrapper = styled.header`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => props.height}px;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Side = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonGroup = styled.div`
  & > button {
    margin-right: 6px;
  }
  & > button:last-of-type {
    margin-right: 0;
  }
`;

const Separator = styled.div`
  width: 1px;
  height: ${props => props.height / 2}px;
  background: ${COLORS.gray[200]};
  margin: 0 6px;
`;

export default Header;
