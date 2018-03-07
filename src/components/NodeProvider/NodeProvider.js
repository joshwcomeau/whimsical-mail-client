// @flow
/**
 * This web app requires knowledge of where certain elements are on the page.
 * It should contain a map of critical HTML element nodes, and should provide
 * a consumer that can provide ref-capturers so that they can be gathered.
 * Also, resize handling presumably?
 */
import React, { Component } from 'react';

// $FlowFixMe
const NodeContext = React.createContext('node');

type Props = { children: React$Node };
class NodeProvider extends Component<Props> {
  refs: { [key: string]: HTMLElement } = {};

  captureRef = (id: string, node: HTMLElement) => (this.refs[id] = node);

  render() {
    return (
      <NodeContext.Provider
        value={{
          // State
          refs: this.refs,

          // Actions
          captureRef: this.captureRef,
        }}
      >
        {this.props.children}
      </NodeContext.Provider>
    );
  }
}

export const NodeConsumer = NodeContext.Consumer;

export default NodeProvider;
