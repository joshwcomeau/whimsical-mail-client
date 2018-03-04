// @flow
import React, { Component } from 'react';

import MailProvider from '../MailProvider';
import Sidebar from '../Sidebar';

type Props = {};

class App extends Component<Props> {
  render() {
    return (
      <MailProvider>
        <Sidebar />
      </MailProvider>
    );
  }
}

export default App;
