import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  height: number,
  offset: number,
  color: string,
};

class HighlightRectangle extends Component<Props> {
  state = {
    distance: 0,
  };

  static defaultProps = {
    color: 'white',
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.offset !== nextProps.offset) {
      this.setState({
        distance: Math.abs(this.props.offset - nextProps.offset),
      });
    }
  }

  render() {
    const { height, color, offset } = this.props;
    const { distance } = this.state;

    return (
      <Rectangle
        height={height}
        color={color}
        offset={offset}
        distance={distance}
      />
    );
  }
}

const Rectangle = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  right: -1px;
  height: ${props => props.height}px;
  left: 10px;
  background: ${props => props.color};
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  /* border-bottom: 2px solid rgba(0, 0, 0, 0.2); */
  transform: translateY(${props => props.offset}px);
  transition: transform ${props => props.distance * 1.35}ms ease-out;
  /* transition: transform 400ms ease-out; */
`;

export default HighlightRectangle;
