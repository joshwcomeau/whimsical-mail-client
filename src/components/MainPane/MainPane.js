import React, { Component } from 'react';

import Header from '../Header';

class MainPane extends Component {
  render() {
    const { headerHeight } = this.props;

    return <Header height={headerHeight} />;
  }
}

export default MainPane;
