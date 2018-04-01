// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { pick } from '../../utils';

import Scoocher from '../Scoocher';
import SidebarHeading from '../SidebarHeading';
import { NodeConsumer } from '../NodeProvider';
import { EmailConsumer } from '../EmailProvider';

import type { BoxId } from '../../types';

type Props = {
  height: number,
  selectedBoxId: BoxId,
  handleSelectBox: (box: BoxId) => void,
};

const boxIds: Array<BoxId> = ['inbox', 'outbox', 'drafts'];

class SidebarHeader extends PureComponent<Props> {
  render() {
    const { height, selectedBoxId, handleSelectBox } = this.props;

    return (
      <EmailConsumer>
        {({ selectedBoxId, selectBox }) => (
          <Wrapper height={height}>
            <InnerWrapper>
              {boxIds.map(boxId => (
                <Fragment key={boxId}>
                  <SidebarHeading
                    boxId={boxId}
                    height={height}
                    isSelected={selectedBoxId === boxId}
                    handleClick={() => selectBox(boxId)}
                  />
                </Fragment>
              ))}
              <NodeConsumer>
                {({ nodes, boundingBoxes }) => {
                  return (
                    <Scoocher
                      offsetY={
                        // Our 60px header includes a 1px border.
                        // We want our scoocher to sit just above the border, so we
                        // adjust it up by 1px.
                        -1
                      }
                      headerNodeIds={boxIds}
                      selectedNodeId={selectedBoxId}
                      boundingBoxes={boundingBoxes}
                    />
                  );
                }}
              </NodeConsumer>
            </InnerWrapper>
          </Wrapper>
        )}
      </EmailConsumer>
    );
  }
}

const Wrapper = styled.div`
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 270px;
  padding-left: 24px;
`;

export default SidebarHeader;
