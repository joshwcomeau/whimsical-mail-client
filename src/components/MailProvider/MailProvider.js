import React, { Component, Fragment } from 'react';
import produce from 'immer';

const MailContext = React.createContext('mail');

const initialData = [
  {
    id: 'a',
    from: {
      name: 'Alice B.',
      email: 'alice@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date(),
    subject: 'OMG did you see what Trump said?',
    body: (
      <Fragment>
        <p>Hello!</p>
        <p>I hope you're doing well today!</p>
      </Fragment>
    ),
  },
  {
    id: 'b',
    from: {
      name: 'Bob C.',
      email: 'bob@gmail.com',
      avatarSrc: 'https://source.unsplash.com/random/100x100',
    },
    timestamp: new Date() - 100000,
    subject: 'JS Fatigue Fatigue Fatigue',
    body: (
      <Fragment>
        <p>Hello!</p>
        <p>I hope you're doing well today!</p>
      </Fragment>
    ),
  },
];

class MailProvider extends Component {
  state = {
    mail: initialData,
  };

  markAsRead = id => {
    const nextState = produce(this.state, draftState => {
      draftState.mail[id].read = true;
    });

    this.setState(nextState);

    // this.setState({
    //   mail: {
    //     ...this.state.mail,
    //     [id]: {
    //       ...this.state.mail.id
    //     }
    //   }
    // })
  };

  render() {
    return (
      <MailContext.Provider
        value={{
          mail: this.state.mail,
          mailArray: Object.values(this.state.mail),
          markAsRead: this.markAsRead,
        }}
      >
        {this.props.children}
      </MailContext.Provider>
    );
  }
}

export const MailConsumer = MailContext.Consumer;

export default MailProvider;
