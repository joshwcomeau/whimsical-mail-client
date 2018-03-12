// @flow
import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import ChildTraveller from './ChildTraveller';
import WindowDimensions from '../WindowDimensions';

type Quadrant = 1 | 2 | 3 | 4;

type Props = {
  startingQuadrant: Quadrant,
  fromQuadrants: Array<Quadrant>,
  toQuadrants: Array<Quadrant>,
};

type State = {
  direction: 'to' | 'from' | null,
  target: ?ClientRect,
};

class Wrapper extends Component<Props, State> {
  static defaultProps = {
    startingQuadrant: 1,
  };

  state = {
    direction: null,
    target: null,
  };

  nodes: {
    [Quadrant]: HTMLElement,
  } = {};

  componentDidMount() {
    const from = this.nodes[this.props.startingQuadrant];

    this.setState({
      direction: 'from',
      target: from.getBoundingClientRect(),
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

  getPositionForQuadrant = quadrant => {
    switch (quadrant) {
      case 1:
        return { top: 30, left: 40 };
      case 2:
        return { top: 30, right: 40 };
      case 3:
        return { bottom: 30, left: 40 };
      case 4:
        return { bottom: 30, right: 40 };
      default:
        throw new Error('Unrecognized quadrant');
    }
  };

  render() {
    const { fromQuadrants, toQuadrants } = this.props;

    return (
      <WindowDimensions>
        {({ windowWidth, windowHeight }) => (
          <Fragment>
            {fromQuadrants.map(quadrant => (
              <Button
                key={quadrant}
                innerRef={node => (this.nodes[quadrant] = node)}
                style={{
                  position: 'fixed',
                  ...this.getPositionForQuadrant(quadrant),
                }}
                onClick={() => this.goFrom(this.nodes[quadrant])}
              >
                From
              </Button>
            ))}

            {toQuadrants.map(quadrant => (
              <Button
                key={quadrant}
                innerRef={node => (this.nodes[quadrant] = node)}
                style={{
                  position: 'fixed',
                  ...this.getPositionForQuadrant(quadrant),
                }}
                onClick={() => this.goTo(this.nodes[quadrant])}
              >
                To
              </Button>
            ))}

            {this.state.direction &&
              this.state.target && (
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
  .add('default (top to bottom)', () => (
    <Wrapper fromQuadrants={[1, 2]} toQuadrants={[3, 4]} />
  ))
  .add('corners', () => (
    <Wrapper fromQuadrants={[1, 4]} toQuadrants={[2, 3]} />
  ));
