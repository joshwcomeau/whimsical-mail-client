// @flow
import React, { Component } from 'react';
import produce from 'immer';

import { parseEmailString } from '../../helpers/email.helpers';

import { generateData, getRandomAvatar } from './EmailProvider.data';
import { AuthenticationConsumer } from '../AuthenticationProvider';

import type { UserData, EmailData, BoxId } from '../../types';

// $FlowFixMe
const EmailContext = React.createContext('email');

type Props = {
  userData: UserData,
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
    emails: generateData(this.props.userData, 30),
    selectedBoxId: 'inbox',
    selectedEmailId: 'a',
    notificationOnBoxes: [],
  };

  viewEmail = (id: number) => {
    const nextState = produce(this.state, draftState => {
      draftState.selectedEmailId = id;

      // Selecting a letter automatically marks it as read.
      draftState.emails.set(id, {
        ...draftState.emails.get(id),
        unread: false,
      });
    });

    this.setState(nextState);
  };

  addNewEmailToBox = ({ boxId, toEmail, subject, body }: any) => {
    const id = this.state.emails.size + 1;

    const to = parseEmailString(toEmail);
    to.avatarSrc = getRandomAvatar();

    const newEmail = {
      id,
      boxId,
      to,
      from: this.props.userData,
      subject,
      body,
      unread: true,
      timestamp: Date.now(),
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

    console.log(emails, emailList);

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

const withEnvironmentData = WrappedComponent => (props: any) => (
  <AuthenticationConsumer>
    {({ userData }) => <WrappedComponent {...props} userData={userData} />}
  </AuthenticationConsumer>
);

export default withEnvironmentData(EmailProvider);
