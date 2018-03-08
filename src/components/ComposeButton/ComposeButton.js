// @flow
import React from 'react';

import { ModalConsumer } from '../ModalProvider';
import { NodeConsumer } from '../NodeProvider';
import Button from '../Button';

const ComposeButton = () => {
  return (
    <ModalConsumer>
      {({ openModal }) => (
        <NodeConsumer>
          {({ refCapturer, nodes }) => (
            <Button
              innerRef={node => refCapturer('compose-button', node)}
              onClick={() => openModal('compose', nodes['compose-button'])}
            >
              Compose
            </Button>
          )}
        </NodeConsumer>
      )}
    </ModalConsumer>
  );
};

export default ComposeButton;
