// @flow
import React from 'react';
import styled from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';

import { COLORS } from '../../constants';

import Button from '../Button';
import Spacer from '../Spacer';
import ComposeEmailAddressInput from '../ComposeEmailAddressInput';

import type { ComposingEmailData } from '../../types';

type Props = {
  emailData: ComposingEmailData,
  updateField: (fieldName: string) => (val: string) => void,
  handleSend: () => void,
  handleSave: () => void,
  handleClear: () => void,
  isClearing: boolean,
};

const ComposeEmail = ({
  emailData,
  updateField,
  handleSend,
  handleSave,
  handleClear,
  isClearing,
}: Props) => (
  <Wrapper>
    <ModalContents>
      <Header>
        <ComposeEmailAddressInput
          disabled
          value="Josh Comeau <joshua@khanacademy.org>"
          label="from"
        />
        <ComposeEmailAddressInput
          value={emailData.toEmail}
          onChange={updateField('toEmail')}
          label="to"
          placeholder="jane@example.com"
        />
      </Header>

      <MainContent>
        <Subject
          placeholder="Subject"
          value={emailData.subject}
          onChange={updateField('subject')}
          isVisible={!isClearing}
        />
        <Body
          placeholder="Write something..."
          value={emailData.body}
          onChange={updateField('body')}
          isVisible={!isClearing}
        />
      </MainContent>

      <Footer>
        <Side>
          <Button secondary onClick={handleClear}>
            <ClearCopy>Clear</ClearCopy>
          </Button>
        </Side>
        <Side>
          <Button secondary onClick={handleSave}>
            <DraftCopy>Save</DraftCopy>
          </Button>
          <Spacer size={24} />
          <Button onClick={handleSend}>
            <SendIcon />
          </Button>
        </Side>
      </Footer>
    </ModalContents>
  </Wrapper>
);

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
  margin: 6px;
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
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  border-top: 1px solid ${COLORS.gray[200]};
`;

const Side = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonText = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const ClearCopy = styled(ButtonText)`
  color: ${COLORS.red[500]};
`;

const DraftCopy = styled(ButtonText)`
  color: ${COLORS.purple[700]};
`;

const InvisibleTextarea = styled.textarea`
  display: block;
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transition: ${props =>
    props.isVisible ? 'opacity 200ms' : 'opacity 750ms ease-out 250ms'};

  &:focus::placeholder {
    color: ${COLORS.blue[700]};
    opacity: 0.6;
  }
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
