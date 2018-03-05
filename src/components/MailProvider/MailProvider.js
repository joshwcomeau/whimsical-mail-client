import React, { Component, Fragment } from 'react';
import produce from 'immer';

const MailContext = React.createContext('mail');

const initialData = {
  a: {
    id: 'a',
    from: {
      name: 'Alice B.',
      email: 'alice@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date(),
    subject: 'OMG did you see what Trump said?',
    preview: 'Hello! I hope you are doing well today.',
    body: (
      <Fragment>
        <p>Hello!</p>
        <p>I hope you're doing well today!</p>
      </Fragment>
    ),
  },
  b: {
    id: 'b',
    from: {
      name: 'Bob C.',
      email: 'bob@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date() - 100000,
    subject: 'JS Fatigue Fatigue Fatigue',
    preview:
      'Is it just me, or are you sick of people being fatigued about javascript fatigue?',
    body: (
      <Fragment>
        <p>
          Is it just me, or are you sick of people being fatigued about
          javascript fatigue?
        </p>
      </Fragment>
    ),
  },
  c: {
    id: 'c',
    from: {
      name: 'Bob C.',
      email: 'bob@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date() - 100000,
    subject: 'JS Fatigue Fatigue Fatigue',
    preview:
      'Is it just me, or are you sick of people being fatigued about javascript fatigue?',
    body: (
      <Fragment>
        <p>
          Is it just me, or are you sick of people being fatigued about
          javascript fatigue?
        </p>
      </Fragment>
    ),
  },
  d: {
    id: 'd',
    from: {
      name: 'Bob C.',
      email: 'bob@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date() - 100000,
    subject: 'JS Fatigue Fatigue Fatigue',
    preview:
      'Is it just me, or are you sick of people being fatigued about javascript fatigue?',
    body: (
      <Fragment>
        <p>
          Is it just me, or are you sick of people being fatigued about
          javascript fatigue?
        </p>
      </Fragment>
    ),
  },
  e: {
    id: 'e',
    from: {
      name: 'Bob C.',
      email: 'bob@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date() - 100000,
    subject: 'JS Fatigue Fatigue Fatigue',
    preview:
      'Is it just me, or are you sick of people being fatigued about javascript fatigue?',
    body: (
      <Fragment>
        <p>
          Is it just me, or are you sick of people being fatigued about
          javascript fatigue?
        </p>
      </Fragment>
    ),
  },
};

class MailProvider extends Component {
  state = {
    mail: initialData,
    selectedLetterId: 'a',
  };

  selectLetter = id => {
    const nextState = produce(this.state, draftState => {
      draftState.selectedLetterId = id;

      // Selecting a letter automatically marks it as read.
      draftState.mail[id].read = true;
    });

    this.setState(nextState);
  };

  render() {
    const { mail, selectedLetterId } = this.state;
    const mailArray = Object.values(mail);
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
