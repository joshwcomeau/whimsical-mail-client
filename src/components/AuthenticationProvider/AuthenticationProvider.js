// @flow
import React, { Component } from 'react';

import avatarMe from '../../assets/avatars/me.jpg';

import type { UserData } from '../../types';

// $FlowFixMe
const AuthenticationContext = React.createContext('authentication');

// NOTE: So this is a demo, in which authentication is just "background noise".
// This is not a real authentication provider, it's just a container for this
// fake "fixture" data:
const USER_DATA = {
  name: 'Josh Comeau',
  email: 'joshua@khanacademy.org',
  avatarSrc: avatarMe,
};

type Props = {
  children: React$Node,
};

type State = {
  isAuthenticated: boolean,
  userData: UserData,
};

class AuthenticationProvider extends Component<Props, State> {
  state = {
    isAuthenticated: true,
    userData: USER_DATA,
  };

  render() {
    const { isAuthenticated, userData } = this.state;

    return (
      <AuthenticationContext.Provider
        value={{
          // State
          isAuthenticated,
          userData,
        }}
      >
        {this.props.children}
      </AuthenticationContext.Provider>
    );
  }
}

export const AuthenticationConsumer = AuthenticationContext.Consumer;

export default AuthenticationProvider;
