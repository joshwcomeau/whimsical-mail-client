// @flow
import React, { Component } from 'react';

import type { NewEmailAnimationId } from '../../types';

// $FlowFixMe
const NewEmailAnimationsContext = React.createContext('animations');

type Props = {
  children: React$Node,
};
type State = {
  currentAnimation: NewEmailAnimationId,
};

type RefMap = { [key: string]: HTMLElement };

class NewEmailAnimationsProvider extends Component<Props, State> {
  state = {
    currentAnimation: null,
  };

  elementRefs = {};

  startComposingEmail = () => {
    this.setState({ currentAnimation: 'open' });
  };

  markAnimationAsCompleted = () => {
    this.setState({ currentAnimation: null });
  };

  captureRef = (id: string, elem: HTMLElement) => (this.elementRefs[id] = elem);

  render() {
    const { currentAnimation } = this.state;

    return (
      <NewEmailAnimationsContext.Provider
        value={{
          // State
          currentAnimation,

          // Actions
          startComposingEmail: this.startComposingEmail,
          markAnimationAsCompleted: this.markAnimationAsCompleted,

          // Misc
          captureRef: this.captureRef,
        }}
      >
        {this.props.children}
      </NewEmailAnimationsContext.Provider>
    );
  }
}

export const NewEmailAnimationsConsumer = NewEmailAnimationsContext.Consumer;

export default NewEmailAnimationsProvider;
