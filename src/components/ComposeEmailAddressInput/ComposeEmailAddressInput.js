// @flow
/**
 * This is yet another "fake" component. It doesn't do anything with the values
 * typed into it.
 */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  id: string,
  value: string,
  label: string,
  height: number,
  isVisible: boolean,
  onChange: (ev: SyntheticEvent<any>) => void,
};

class ComposeEmailAddressInput extends PureComponent<Props> {
  static defaultProps = {
    height: 32,
  };

  render() {
    const {
      label,
      value,
      onChange,
      height,
      isVisible,
      ...delegated
    } = this.props;

    return (
      <Wrapper height={height}>
        <TextLabel>{label}:</TextLabel>
        <Input
          type="email"
          value={value}
          onChange={this.props.onChange}
          {...delegated}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.label`
  display: flex;
  align-items: center;
  height: ${props => props.height}px;
  font-size: 14px;
`;

const TextLabel = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 6px;
  color: ${COLORS.gray[500]};
`;

const Input = styled.input`
  flex: 1;
  height: 28px;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0.25);
  outline: none;
  transform: translateY(1px);
  font-size: 14px;
  backface-visibility: hidden;

  &:focus {
    border-bottom: 2px solid ${COLORS.blue[700]};
  }

  &::placeholder {
    opacity: 0.4;
  }
`;

export default ComposeEmailAddressInput;
