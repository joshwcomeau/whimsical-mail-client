// @flow
import React, { PureComponent } from 'react';

import { debounce } from '../../utils';

type State = {
  width: number,
  height: number,
};

type Props = {
  children: (args: State) => React$Node,
};

class WindowDimensions extends PureComponent<Props, State> {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowSize);
  }

  updateWindowSize = debounce(() => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 100);

  render() {
    return this.props.children(this.state);
  }
}

export default WindowDimensions;
