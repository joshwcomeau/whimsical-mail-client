// @flow
import React, { Component } from 'react';

import type { ModalId } from '../../types';

// $FlowFixMe
const ModalContext = React.createContext('modal');

type Props = { children: React$Node };
type State = {
  // For this app, I've chosen to limit it to 1 active modal at a time.
  // This is an artificial constraint, though. If you needed multiple modals,
  // you could use a map-like object, eg { [modalId: string]: boolean }
  currentModal: ?ModalId,
  openFromNode: ?HTMLElement,
  delegated: any,
};

class ModalProvider extends Component<Props, State> {
  state = {
    currentModal: null,
    openFromNode: null,
    delegated: null,
  };

  openModal = (modalId: ModalId, openFromNode: HTMLElement, delegated: any) =>
    this.setState({ currentModal: modalId, openFromNode, delegated });

  closeModal = () => {
    this.setState({ currentModal: null });
  };

  render() {
    const { children } = this.props;
    const { currentModal, openFromNode, delegated } = this.state;

    return (
      <ModalContext.Provider
        value={{
          // State
          currentModal,
          openFromNode,
          ...delegated,

          // Actions
          openModal: this.openModal,
          closeModal: this.closeModal,
        }}
      >
        {children}
      </ModalContext.Provider>
    );
  }
}

export const ModalConsumer = ModalContext.Consumer;

export default ModalProvider;
