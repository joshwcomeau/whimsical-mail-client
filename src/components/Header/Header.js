// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

type Props = {
  height: number,
};
class Header extends Component {
  render() {
    const { height } = this.props;

    return (
      <Wrapper height={height}>
        <button>Compose</button>
      </Wrapper>
    );
  }
}

const Wrapper = styled.header`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  height: ${props => props.height}px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export default Header;
