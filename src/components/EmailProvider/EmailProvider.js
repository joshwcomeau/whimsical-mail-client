// @flow
import React, { Component } from 'react';
import produce from 'immer';

import { generateData } from './EmailProvider.data';

import type { EmailData } from '../../types';

// $FlowFixMe
const EmailContext = React.createContext('email');

type Props = {
  children: React$Node,
};
type State = {
  emails: Map<number, EmailData>,
  selectedEmailId: number,
};

class EmailProvider extends Component<Props, State> {
  state = {
    emails: generateData(10),
    selectedEmailId: 1,
  };

  viewEmail = (id: number) => {
    const nextState = produce(this.state, draftState => {
      draftState.selectedEmailId = id;

      // Selecting a letter automatically marks it as read.
      draftState.emails.set(id, {
        ...draftState.emails.get(id),
        read: true,
      });
    });

    this.setState(nextState);
  };

  render() {
    const { emails, selectedEmailId } = this.state;

    const emailList = Array.from(emails.values());

    const selectedEmailIndex = emailList.findIndex(
      letter => letter.id === selectedEmailId
    );

    return (
      <EmailContext.Provider
        value={{
          // State
          emails,
          selectedEmailId,

          // Derived values
          // TODO: I wonder if there's a better pattern for these...
          emailList,
          selectedEmail: emails.get(selectedEmailId),

          // Actions
          viewEmail: this.viewEmail,
        }}
      >
        {this.props.children}
      </EmailContext.Provider>
    );
  }
}

export const EmailConsumer = EmailContext.Consumer;

export default EmailProvider;
