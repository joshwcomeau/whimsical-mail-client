// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  selectedNodeId: string,
  nodes: { [key: string]: HTMLElement },
  boundingBoxes: { [key: string]: ClientRect },
  offsetX: number,
  offsetY: number,
};

type State = {
  containerDimensions?: {
    top: number,
    left: number,
    width: number,
    height: number,
  },
  scoocherCoordinates?: {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  },
};

class Scoocher extends PureComponent<Props> {
  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
  };

  node: HTMLElement;

  state = {};

  componentDidMount() {
    console.log('MOUNT', this.props.nodes, this.props.boundingBoxes);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { selectedNodeId, boundingBoxes, offsetX, offsetY } = nextProps;

    // Figure out the extremities of the supplied node refs.
    // Create the minimum rectangle that encompasses all of them.
    let top = Infinity;
    let left = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;

    Object.keys(boundingBoxes).forEach(nodeId => {
      const box = boundingBoxes[nodeId];

      if (box.top < top) {
        top = box.top;
      }
      if (box.left < left) {
        left = box.left;
      }
      if (box.right > right) {
        right = box.right;
      }
      if (box.bottom > bottom) {
        bottom = box.bottom;
      }
    });

    const containerDimensions = {
      top: top + offsetY,
      left: left + offsetX,
      width: right - left,
      height: bottom - top,
    };

    const selectedNodeBox = boundingBoxes[selectedNodeId];

    if (!selectedNodeBox) {
      return null;
    }

    const scoocherCoordinates = {
      x1: selectedNodeBox.left - containerDimensions.left,
      y1: containerDimensions.top + containerDimensions.height,
      x2: selectedNodeBox.right - containerDimensions.left,
      y2: containerDimensions.top + containerDimensions.height,
    };

    this.setState({
      containerDimensions,
      scoocherCoordinates,
    });
  }

  render() {
    const { selectedNodeId, nodes } = this.props;
    const { containerDimensions, scoocherCoordinates } = this.state;

    const selectedNode = nodes[selectedNodeId];

    if (!selectedNode || !containerDimensions || !scoocherCoordinates) {
      return null;
    }

    return (
      <ScoocherContainerSvg style={containerDimensions}>
        <ScoochLine {...scoocherCoordinates} />
      </ScoocherContainerSvg>
    );
  }
}

const ScoocherContainerSvg = styled.svg`
  position: absolute;
  z-index: 10;
  pointer-events: none;
`;

const ScoochLine = styled.line`
  stroke-width: 5px;
  stroke: ${COLORS.pink[500]};
`;

export default Scoocher;
