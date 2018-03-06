// @flow
import React, { Component } from 'react';

// $FlowFixMe
const NewEmailAnimationsContext = React.createContext('animations');

type Props = {
  children: React$Node,
};
type State = {
  currentAnimation: 'open' | 'save' | 'delete' | 'send' | null,
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
