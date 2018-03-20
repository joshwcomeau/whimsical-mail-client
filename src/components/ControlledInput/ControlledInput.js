// @flow
import React, { Component } from 'react';

type Props = {
  children: (
    value: string,
    handleChange: (ev: SyntheticInputEvent<any>) => void
  ) => React$Node,
};

type State = {
  value: string,
};

class ControlledInput extends Component<Props, State> {
  state = {
    value: '',
  };

  handleChange = (ev: SyntheticInputEvent<any>) => {
    this.setState({ value: ev.target.value });
  };

  render() {
    return this.props.children(this.state.value, this.handleChange);
  }
}

export default ControlledInput;
