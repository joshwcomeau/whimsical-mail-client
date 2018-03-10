// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import type { FoldId } from '../../types';

type Props = {
  foldId?: FoldId,
  node: HTMLElement,
};

class Fold extends PureComponent<Props> {
  render() {
    const { node } = this.props;
    console.log(node);
    const { top, left, width, height } = node.getBoundingClientRect();
    // For now, I'm assuming a tri-fold is the only one we need.
    // TODO: figure out abstraction for different folds.

    const topFoldNode = node;
    const middleFoldNode = node.cloneNode(true);
    const bottomFoldNode = node.cloneNode(true);

    return (
      <Wrapper style={{ top, left, width, height }}>
        <TopFold height={height}>
          <TopFoldContents
            dangerouslySetInnerHTML={{ __html: topFoldNode.outerHTML }}
          />
        </TopFold>

        <MiddleFold height={height}>
          <MiddleFoldContents
            height={height}
            dangerouslySetInnerHTML={{ __html: middleFoldNode.outerHTML }}
          />
        </MiddleFold>

        <BottomFold height={height}>
          <BottomFoldContents
            height={height}
            dangerouslySetInnerHTML={{ __html: bottomFoldNode.outerHTML }}
          />
        </BottomFold>
      </Wrapper>
    );
  }
}

const foldBottomUp = keyframes`
  from {
    transform-origin: top center;
    transform: perspective(1000px) rotateX(0deg);
  }
  to {
    transform-origin: top center;
    transform: perspective(1000px) rotateX(180deg);
  }
`;

const foldTopDown = keyframes`
  from {
    transform-origin: bottom center;
    transform: perspective(1000px) rotateX(0deg);
  }
  to {
    transform-origin: bottom center;
    transform: perspective(1000px) rotateX(-180deg);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  z-index: 10000;
`;

const FoldBase = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const TopFold = styled(FoldBase)`
  z-index: 3;
  top: 0;
  height: ${props => Math.round(props.height * 0.35)}px;
  animation: ${foldTopDown} 2s forwards 1s;
`;

const MiddleFold = styled(FoldBase)`
  z-index: 1;
  top: ${props => Math.round(props.height * 0.35)}px;
  height: ${props => Math.round(props.height * 0.35)}px;
`;

const BottomFold = styled(FoldBase)`
  z-index: 2;
  top: ${props => Math.round(props.height * 0.7)}px;
  height: ${props => Math.round(props.height * 0.3)}px;
  animation: ${foldBottomUp} 2s forwards;
`;

const TopFoldContents = styled.div``;
const MiddleFoldContents = styled.div`
  height: ${props => props.height}px;
  transform: translateY(-${props => Math.round(props.height * 0.35)}px);
`;
const BottomFoldContents = styled.div`
  height: ${props => props.height}px;
  transform: translateY(-${props => Math.round(props.height * 0.7)}px);
`;

export default Fold;
