// @flow
import React, { Component } from 'react';
import produce from 'immer';

import {
  generateData,
  loggedInUserData,
  getRandomAvatar,
} from './EmailProvider.data';

import type { EmailData, BoxId } from '../../types';

// $FlowFixMe
const EmailContext = React.createContext('email');

type Props = {
  children: React$Node,
};
type State = {
  emails: Map<number, EmailData>,
  selectedBoxId: BoxId,
  selectedEmailId: number,
  notificationOnBoxes: Array<BoxId>,
};

class EmailProvider extends Component<Props, State> {
  state = {
    emails: generateData(30),
    selectedBoxId: 'inbox',
    selectedEmailId: 1,
    notificationOnBoxes: [],
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

  addNewEmailToBox = ({ boxId, to, subject, body }: any) => {
    // NOTE: This is totally unrealistic.
    // I'm doing this in a very unrealistic way, because this stuff isn't core
    // to what the demo is demonstrating.
    const id = this.state.emails.size + 1;

    const from = loggedInUserData;

    const newEmail = {
      id,
      boxId,
      from: loggedInUserData,
      to: {
        email: to,
        name: 'Some Name',
        avatarSrc: getRandomAvatar(),
      },
      timestamp: Date.now(),
      subject,
      preview: body,
      body,
    };

    const addNotification =
      !this.state.notificationOnBoxes.includes(boxId) &&
      this.state.selectedBoxId !== boxId;

    this.setState({
      emails: this.state.emails.set(id, newEmail),
      notificationOnBoxes: addNotification
        ? [...this.state.notificationOnBoxes, boxId]
        : this.state.notificationOnBoxes,
    });
  };

  selectBox = (boxId: BoxId) => {
    this.setState({
      selectedBoxId: boxId,
      notificationOnBoxes: this.state.notificationOnBoxes.filter(
        notificationOnBoxId => notificationOnBoxId !== boxId
      ),
    });
  };

  render() {
    const {
      emails,
      selectedBoxId,
      selectedEmailId,
      notificationOnBoxes,
    } = this.state;

    const emailList = Array.from(emails.values())
      .filter(email => email.boxId === selectedBoxId)
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

    const selectedEmailIndex = emailList.findIndex(
      letter => letter.id === selectedEmailId
    );

    return (
      <EmailContext.Provider
        value={{
          // State
          emails,
          selectedBoxId,
          selectedEmailId,
          notificationOnBoxes,

          // Derived values
          // TODO: I wonder if there's a better pattern for these...
          emailList,
          selectedEmail: emails.get(selectedEmailId),

          // Actions
          selectBox: this.selectBox,
          viewEmail: this.viewEmail,
          addNewEmailToBox: this.addNewEmailToBox,
        }}
      >
        {this.props.children}
      </EmailContext.Provider>
    );
  }
}

export const EmailConsumer = EmailContext.Consumer;

export default EmailProvider;
