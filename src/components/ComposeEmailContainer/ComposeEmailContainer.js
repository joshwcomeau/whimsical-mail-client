// @flow
import React, { Component } from 'react';

import { NodeConsumer } from '../NodeProvider';
import ChildTransporter from '../ChildTransporter';
import FoldableLetter from '../FoldableLetter';
import WindowDimensions from '../WindowDimensions';

import type { Nodes } from '../NodeProvider/NodeProvider';

type ComposeEmailStep = 'open' | 'folding' | 'closed';

type Props = {
  isOpen: boolean,
  handleClose: () => void,
};
type State = {
  status: ComposeEmailStep,
  actionBeingPerformed: 'send' | 'save' | 'delete' | null,
};

class ComposeEmailContainer extends Component<Props, State> {
  state = {
    status: this.props.isOpen ? 'open' : 'closed',
    actionBeingPerformed: null,
  };

  renderFront() {
    return <div>Front</div>;
  }

  renderBack() {
    return <div>Back</div>;
  }

  render() {
    const { isOpen } = this.props;
    const { status } = this.state;

    return (
      <NodeConsumer>
        {({ nodes }) => (
          <WindowDimensions>
            {({ windowWidth, windowHeight }) => (
              <ChildTransporter
                from={nodes['compose-button']}
                to={nodes['outbox']}
                isOpen={isOpen}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              >
                <FoldableLetter
                  isFolded={status === 'folding'}
                  front={this.renderFront()}
                  back={this.renderBack()}
                />
              </ChildTransporter>
            )}
          </WindowDimensions>
        )}
      </NodeConsumer>
    );
  }
}

export default ComposeEmailContainer;
