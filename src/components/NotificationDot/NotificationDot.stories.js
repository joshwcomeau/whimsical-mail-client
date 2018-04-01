import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import NotificationDot from './NotificationDot';

class Toggler extends Component {
  state = {
    toggled: false,
  };

  toggle = () => {
    this.setState({ toggled: !this.state.toggled });
  };

  render() {
    return (
      <Fragment>
        <input type="checkbox" onChange={this.toggle} />
        <br />
        <br />
        <div style={{ padding: 100 }}>
          {this.state.toggled && <NotificationDot {...this.props} />}
        </div>
      </Fragment>
    );
  }
}

storiesOf('NotificationDot', module)
  .add('default', () => <Toggler size={10} />)
  .add('large', () => <Toggler size={60} />);
