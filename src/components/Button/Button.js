// @flow
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const Button = ({ primary, secondary, ...delegated }) => {
  if (secondary) {
    return <SecondaryButton {...delegated} />;
  }

  return <PrimaryButton {...delegated} />;
};

const ButtonBase = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: none;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
`;

const PrimaryButton = styled(ButtonBase)`
  padding: 0 20px;
  /* TODO: Reconcile this with the colors in constants.COLORS */
  background: linear-gradient(-10deg, #8364f5, #f4108f);
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
`;

const SecondaryButton = styled(ButtonBase)`
  padding: 0 10px;
  font-size: 25px;
  color: ${COLORS.gray[800]};
`;

export default Button;
