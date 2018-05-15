// @flow
import React, { PureComponent, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  isFolded: boolean,
  front: React$Element<*>,
  back: React$Element<*>,
  duration: number,
  onCompleteFolding: () => void,
};

class Foldable extends PureComponent<Props> {
  static defaultProps = {
    duration: 1000,
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
    const { front, isFolded } = this.props;

    return (
      <div
        ref={node => (this.node = node)}
        style={{ opacity: isFolded ? 0 : 1 }}
      >
        {front}
      </div>
    );
  }

  renderFoldedCopy() {
    const { back, duration } = this.props;
    const { node } = this;

    // If we weren't able to capture a ref to the node, we can't do any of this
    // However, I think that's impossible? This is just for Flow.
    if (!node) {
      return;
    }

    const { width, height } = node.getBoundingClientRect();

    const foldHeights = [height * 0.35, height * 0.35, height * 0.3];

    // HACK: using top: 0 and left: 0 because this is mounted within a
    // transformed container, which means that position: fixed doesn't work
    // properly. If you want to use this in an app, you'll likely wish to use
    // the top/left from node.getBoundingClientRect.
    return (
      <Wrapper style={{ top: 0, left: 0, width, height }}>
        <TopFold
          innerRef={node => (this.finalFoldNode = node)}
          duration={duration}
          foldHeight={foldHeights[0]}
        >
          <HideOverflow>
            <TopFoldContents
              foldHeight={foldHeights[0]}
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
          </HideOverflow>
          <TopFoldBack>{back}</TopFoldBack>
        </TopFold>

        <MiddleFold foldHeight={foldHeights[1]} offsetTop={foldHeights[0]}>
          <HideOverflow>
            <MiddleFoldContents
              offsetTop={foldHeights[0]}
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
          </HideOverflow>
        </MiddleFold>

        <BottomFold
          duration={duration}
          foldHeight={foldHeights[2]}
          offsetTop={foldHeights[0] + foldHeights[1]}
        >
          <HideOverflow>
            <BottomFoldContents
              offsetTop={foldHeights[0] + foldHeights[1]}
              dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
          </HideOverflow>
          <BottomFoldBack />
        </BottomFold>
      </Wrapper>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderOriginal()}
        {this.props.isFolded && this.renderFoldedCopy()}
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
  height: ${props => Math.round(props.foldHeight)}px;
  animation: ${foldTopDown} ${props => props.duration * 0.8}ms forwards
    ${props => props.duration * 0.33}ms;
  transform-style: preserve-3d;
`;

const MiddleFold = styled(FoldBase)`
  z-index: 1;
  top: ${props => Math.round(props.offsetTop)}px;
  height: ${props => Math.round(props.foldHeight)}px;
`;

const BottomFold = styled(FoldBase)`
  z-index: 2;
  top: ${props => Math.round(props.offsetTop)}px;
  height: ${props => Math.round(props.foldHeight)}px;
  animation: ${foldBottomUp} ${props => props.duration}ms forwards;
  transform-style: preserve-3d;
`;

const HideOverflow = styled.div`
  position: relative;
  height: 100%;
  z-index: 2;
  overflow: hidden;
`;

const TopFoldContents = styled.div`
  backface-visibility: hidden;
`;
const MiddleFoldContents = styled.div`
  position: relative;
  z-index: 2;
  height: ${props => props.height}px;
  transform: translateY(${props => Math.round(props.offsetTop) * -1}px);
`;
const BottomFoldContents = styled.div`
  position: relative;
  z-index: 2;
  height: ${props => props.height}px;
  transform: translateY(${props => Math.round(props.offsetTop) * -1}px);
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
  box-shadow: 0px -30px 50px -20px rgba(0, 0, 0, 0.2);
`;

export default Foldable;
