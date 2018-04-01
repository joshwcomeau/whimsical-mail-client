import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import NotificationDot from './NotificationDot';

class Toggler extends Component {
  state = {
    toggled: true,
  };

  render() {
    return (
      <Fragment>
        <input type={checkbox} onChange={this.toggle} />
        {this.state.toggled && <NotificationDot />}
      </Fragment>
    );
  }
}

storiesOf('NotificationDot', module).add('default', () => <Toggler />);
