import React, { Component, Fragment } from 'react';
import produce from 'immer';

import { generateData } from './MailProvider.data';

const MailContext = React.createContext('mail');

class MailProvider extends Component {
  state = {
    mail: generateData(10),
    selectedLetterId: 'a',
  };

  selectLetter = id => {
    const nextState = produce(this.state, draftState => {
      draftState.selectedLetterId = id;

      // Selecting a letter automatically marks it as read.
      draftState.mail.set(id, {
        ...draftState.mail.get(id),
        read: true,
      });
    });

    this.setState(nextState);
  };

  render() {
    const { mail, selectedLetterId } = this.state;

    const mailArray = Array.from(mail.values());

    const selectedLetterIndex = mailArray.findIndex(
      letter => letter.id === selectedLetterId
    );

    return (
      <MailContext.Provider
        value={{
          mail,
          mailArray,
          selectedLetterId,
          selectedLetterIndex,
          selectLetter: this.selectLetter,
        }}
      >
        {this.props.children}
      </MailContext.Provider>
    );
  }
}

export const MailConsumer = MailContext.Consumer;

export default MailProvider;
