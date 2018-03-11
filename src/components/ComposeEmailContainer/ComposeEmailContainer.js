// @flow
import React, { Component } from 'react';

import { NodeConsumer } from '../NodeProvider';
import ChildTraveller from '../ChildTraveller';

import type { Nodes } from '../NodeProvider/NodeProvider';

type ComposeEmailStep = 'opening' | 'open' | 'folding' | 'closing' | 'closed';

type Props = {};
type State = {
  step: ComposeEmailStep,
  actionBeingPerformed: 'send' | 'save' | 'delete',
};

class ComposeEmailContainer extends Component<Props, State> {
  getDirectionAndTargetForChildTraveller = (nodes: Nodes) => {
    switch (this.state.step) {
      case 'closing':
      case 'closed':
        return { target: nodes['outbox'], direction: 'to' };
      default:
        return { target: nodes['compose-button'], direction: 'from' };
    }
  };

  getDirectionForChildTraveller = () => {
    switch (this.state.step) {
    }
  };

  render() {
    const { step, actionBeingPerformed } = this.state;

    return (
      <NodeConsumer>
        {({ nodes }) => (
          <ChildTraveller
            {...this.getDirectionAndTargetForChildTraveller(nodes)}
          />
        )}
      </NodeConsumer>
    );
  }
}

export default ComposeEmailContainer;
