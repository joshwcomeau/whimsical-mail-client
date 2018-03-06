// @flow
/**
 * This web app requires knowledge of where certain elements are on the page.
 * It should contain a map of critical HTML element nodes, and should provide
 * a consumer that can provide ref-capturers so that they can be gathered.
 * Also, resize handling presumably?
 */
import React, { Component } from 'react';

class NodeProvider extends Component {
  render() {
    return <div />;
  }
}

export default NodeProvider;
