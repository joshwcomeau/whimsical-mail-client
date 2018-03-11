import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import ChildTraveller from './ChildTraveller';
import WindowDimensions from '../WindowDimensions';

class Wrapper extends Component {
  state = {
    isVisible: false,
    direction: null,
    target: null,
  };

  componentDidMount() {
    this.setState({
      isVisible: true,
      direction: 'from',
      target: this.from2.getBoundingClientRect(),
    });
  }

  goTo = node => {
    this.setState({ direction: 'to', target: node.getBoundingClientRect() });
  };

  goFrom = node => {
    this.setState({
      direction: 'from',
      target: node.getBoundingClientRect(),
    });
  };

  render() {
    return (
      <WindowDimensions>
        {({ windowWidth, windowHeight }) => (
          <Fragment>
            <Button
              innerRef={node => (this.from1 = node)}
              style={{ position: 'fixed', top: 30, left: 40 }}
              onClick={() => this.goFrom(this.from1)}
            >
              From
            </Button>

            <Button
              innerRef={node => (this.from2 = node)}
              style={{ position: 'fixed', bottom: 100, right: 40 }}
              onClick={() => this.goFrom(this.from2)}
            >
              From
            </Button>

            <Button
              innerRef={node => (this.to1 = node)}
              style={{ position: 'fixed', rop: 100, right: 40 }}
              onClick={() => this.goTo(this.to1)}
            >
              To
            </Button>

            <Button
              innerRef={node => (this.to2 = node)}
              style={{ position: 'fixed', bottom: 100, left: 40 }}
              onClick={() => this.goTo(this.to2)}
            >
              To
            </Button>

            {this.state.isVisible && (
              <ChildTraveller
                direction={this.state.direction}
                target={this.state.target}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: 'red',
                  }}
                />
              </ChildTraveller>
            )}
          </Fragment>
        )}
      </WindowDimensions>
    );
  }
}

const Button = styled.button`
  position: fixed;
  padding: 20px;
`;

storiesOf('ChildTraveller', module)
  .add('default', () => <Wrapper />)
  .add('default (toggle between to restart)', () => <Wrapper />);
