// @flow
import React, { PureComponent, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  isFolded: boolean,
  front: React$Element<*>,
  back: React$Element<*>,
  speed: number,
  onCompleteFolding: () => void,
};

class FoldableLetter extends PureComponent<Props> {
  static defaultProps = {
    speed: 1000,
  };

  node: ?HTMLElement;
  finalFoldNode: ?HTMLElement;

  componentDidUpdate(prevProps: Props) {
    const { onCompleteFolding } = this.props;

    if (!prevProps.isFolded && this.props.isFolded && this.finalFoldNode) {
      this.finalFoldNode.addEventListener('animationend', onCompleteFolding);
    }
  }

  componentWillUnmount() {
    const { onCompleteFolding } = this.props;

    if (this.finalFoldNode) {
      this.finalFoldNode.removeEventListener('animationend', onCompleteFolding);
    }
  }

  renderOriginal() {
    const { front, speed, isFolded } = this.props;

    return (
      <div
        ref={node => (this.node = node)}
        style={{ display: 'inline-block', opacity: isFolded ? 0 : 1 }}
      >
        {front}
      </div>
    );
  }

  renderFoldedCopy() {
    const { front, back, speed, isFolded } = this.props;
    const { node } = this;

    // If we weren't able to capture a ref to the node, we can't do any of this
    // However, I think that's impossible? This is just for Flow.
    if (!node) {
      return;
    }

    const { top, left, width, height } = node.getBoundingClientRect();

    return (
      <Wrapper style={{ top: 0, left: 0, width, height }}>
        <TopFold
          innerRef={node => (this.finalFoldNode = node)}
          speed={speed}
          height={height}
        >
          <HideOverflow>
            <TopFoldContents
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
          </HideOverflow>
          <TopFoldBack>{back}</TopFoldBack>
        </TopFold>

        <MiddleFold height={height}>
          <HideOverflow>
            <MiddleFoldContents
              height={height}
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
            <MiddleFoldDarken speed={speed} />
          </HideOverflow>
        </MiddleFold>

        <BottomFold speed={speed} height={height}>
          <HideOverflow>
            <BottomFoldContents
              height={height}
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
          </HideOverflow>
          <BottomFoldBack />
        </BottomFold>
      </Wrapper>
    );
  }

  render() {
    const { front, speed, isFolded } = this.props;

    return (
      <Fragment>
        {this.renderOriginal()}
        {isFolded && this.renderFoldedCopy()}
      </Fragment>
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
`;

const TopFold = styled(FoldBase)`
  z-index: 3;
  top: 0;
  height: ${props => Math.round(props.height * 0.35)}px;
  animation: ${foldTopDown} ${props => props.speed * 0.8}ms forwards
    ${props => props.speed * 0.33}ms;
  transform-style: preserve-3d;
`;

const MiddleFold = styled(FoldBase)`
  z-index: 1;
  top: ${props => Math.round(props.height * 0.35)}px;
  height: ${props => Math.round(props.height * 0.35)}px;
  backface-visibility: hidden;
`;

const BottomFold = styled(FoldBase)`
  z-index: 2;
  top: ${props => Math.round(props.height * 0.7)}px;
  height: ${props => Math.round(props.height * 0.3)}px;
  animation: ${foldBottomUp} ${props => props.speed}ms forwards;
  transform-style: preserve-3d;
`;

const HideOverflow = styled.div`
  position: relative;
  height: 100%;
  z-index: 2;
  overflow: hidden;
`;

const MiddleFoldDarken = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} ${props => props.speed}ms;
`;

const TopFoldContents = styled.div`
  backface-visibility: hidden;
`;
const MiddleFoldContents = styled.div`
  position: relative;
  z-index: 2;
  height: ${props => props.height}px;
  transform: translateY(-${props => Math.round(props.height * 0.35)}px);
`;
const BottomFoldContents = styled.div`
  position: relative;
  z-index: 2;
  height: ${props => props.height}px;
  transform: translateY(-${props => Math.round(props.height * 0.7)}px);
  backface-visibility: hidden;
`;

const TopFoldBack = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateX(180deg);
  background: rgba(255, 255, 255, 0.95);
  backface-visibility: hidden;
`;

const BottomFoldBack = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateX(180deg);
  background: rgba(255, 255, 255, 0.95);
  backface-visibility: hidden;
`;

export default FoldableLetter;
