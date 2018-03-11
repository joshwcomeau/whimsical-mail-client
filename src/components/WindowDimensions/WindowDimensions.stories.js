import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import WindowDimensions from './WindowDimensions';

storiesOf('WindowDimensions', module).add('default', () => (
  <WindowDimensions>
    {({ width, height }) => `${width}px by ${height}px`}
  </WindowDimensions>
));
