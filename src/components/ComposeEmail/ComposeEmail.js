// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';

import { COLORS } from '../../constants';

import Button from '../Button';
import ComposeEmailAddressInput from '../ComposeEmailAddressInput';
import ControlledInput from '../ControlledInput';

type Props = {
  updateField: (data: any) => void,
  handleSend: () => void,
};

class ComposeEmail extends Component<Props> {
  render() {
    const { updateField, handleSend } = this.props;
    return (
      <Wrapper>
        <ModalContents>
          <Header>
            <ComposeEmailAddressInput
              disabled
              value="Josh Comeau <joshua@khanacademy.org>"
              id="from"
              label="from"
            />
            <ControlledInput>
              {(value, handleChange) => (
                <ComposeEmailAddressInput
                  value={value}
                  onChange={handleChange}
                  label="to"
                  placeholder="jane@example.com"
                />
              )}
            </ControlledInput>
          </Header>

          <MainContent>
            <ControlledInput id="to">
              {(value, handleChange) => (
                <Subject
                  placeholder="Subject"
                  value={value}
                  onChange={handleChange}
                />
              )}
            </ControlledInput>
            <ControlledInput id="to">
              {(value, handleChange) => (
                <Body
                  placeholder="Write something..."
                  value={value}
                  onChange={handleChange}
                />
              )}
            </ControlledInput>
          </MainContent>

          <Footer>
            <Button onClick={handleSend}>
              <SendIcon />
            </Button>
          </Footer>
        </ModalContents>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 80vh;
  width: 55vh;
`;

const ModalContents = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  margin: 8px;
  background: white;
`;

const Header = styled.div`
  padding: 15px 25px 20px 15px;
  background: ${COLORS.gray[100]};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 106px;
`;

const MainContent = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

const Footer = styled.div`
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  border-top: 1px solid ${COLORS.gray[200]};
`;

const InvisibleTextarea = styled.textarea`
  display: block;
  width: 100%;
  border: none;
  resize: none;
  outline: none;
`;

const Subject = styled(InvisibleTextarea)`
  font-size: 28px;
  padding: 15px 20px 20px;
  text-align: center;
`;
const Body = styled(InvisibleTextarea)`
  flex: 1;
  font-size: 18px;
`;

export default ComposeEmail;
