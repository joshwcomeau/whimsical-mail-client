// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import Scoocher from '../Scoocher';
import SidebarHeading from '../SidebarHeading';
import NotificationDot from '../NotificationDot';
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
    const { height } = this.props;

    return (
      <EmailConsumer>
        {({ selectedBoxId, selectBox, notificationOnBoxes }) => (
          <Wrapper height={height}>
            <InnerWrapper>
              {boxIds.map(boxId => (
                <SidebarHeadingWrapper key={boxId}>
                  <SidebarHeading
                    boxId={boxId}
                    height={height}
                    isSelected={selectedBoxId === boxId}
                    handleClick={() => selectBox(boxId)}
                  />
                  <NotificationDotWrapper>
                    {notificationOnBoxes.includes(boxId) && <NotificationDot />}
                  </NotificationDotWrapper>
                </SidebarHeadingWrapper>
              ))}
              <NodeConsumer>
                {({ nodes, boundingBoxes }) => {
                  return (
                    <Scoocher
                      offsetY={
                        // Our 60px header includes a 1px border.
                        // We want our scoocher to sit just above the border,
                        // so we adjust it up by 1px.
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
  position: relative;
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

const SidebarHeadingWrapper = styled.div`
  position: relative;
`;

const NotificationDotWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8px;
  margin: auto;
  width: 8px;
`;

export default SidebarHeader;
