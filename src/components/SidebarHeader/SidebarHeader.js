// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { pick } from '../../utils';

import Scoocher from '../Scoocher';
import SidebarHeading from '../SidebarHeading';
import { NodeConsumer } from '../NodeProvider';

import type { BoxId } from '../../types';

type Props = {
  height: number,
  selectedBox: BoxId,
  handleSelectBox: (box: BoxId) => void,
};

class SidebarHeader extends PureComponent<Props> {
  render() {
    const { height, selectedBox, handleSelectBox } = this.props;

    const boxIds: Array<BoxId> = ['inbox', 'outbox', 'drafts'];

    return (
      <Wrapper height={height}>
        <InnerWrapper>
          {boxIds.map(boxId => (
            <SidebarHeading
              key={boxId}
              boxId={boxId}
              height={height}
              isSelected={selectedBox === boxId}
              handleClick={() => handleSelectBox(boxId)}
            />
          ))}
          <NodeConsumer>
            {({ nodes, boundingBoxes }) => (
              <Scoocher
                selectedNodeId={selectedBox}
                nodes={pick(nodes, ['inbox', 'outbox', 'drafts'])}
                boundingBoxes={pick(boundingBoxes, [
                  'inbox',
                  'outbox',
                  'drafts',
                ])}
              />
            )}
          </NodeConsumer>
        </InnerWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  background: white;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 270px;
  padding-left: 24px;
`;

export default SidebarHeader;
