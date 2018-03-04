import React, { Component } from 'react';

import { MailConsumer } from '../MailProvider';
import MailListItem from '../MailListItem';

class Sidebar extends Component {
  render() {
    return (
      <MailConsumer>
        {({ mailArray }) =>
          mailArray.map(email => <MailListItem key={email.id} email={email} />)
        }
      </MailConsumer>
    );
  }
}

export default Sidebar;
