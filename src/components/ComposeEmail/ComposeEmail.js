// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';
import SaveIcon from 'react-icons/lib/md/save';
import DeleteIcon from 'react-icons/lib/md/delete';

import { COLORS } from '../../constants';

import Button from '../Button';
import Spacer from '../Spacer';
import ComposeEmailAddressInput from '../ComposeEmailAddressInput';

import type { EmailData } from '../../types';

type Props = {
  emailData: $Shape<EmailData>,
  updateField: (fieldName: string) => (val: string) => void,
  handleSend: () => void,
  handleSave: () => void,
  handleDelete: () => void,
};

class ComposeEmail extends Component<Props> {
  render() {
    const {
      emailData,
      updateField,
      handleSend,
      handleSave,
      handleDelete,
    } = this.props;

    return (
      <Wrapper>
        <ModalContents>
          <Header>
            <ComposeEmailAddressInput
              disabled
              value="Josh Comeau <joshua@khanacademy.org>"
              label="from"
            />
            <ComposeEmailAddressInput
              value={emailData.to.email}
              onChange={updateField('to')}
              label="to"
              placeholder="jane@example.com"
            />
          </Header>

          <MainContent>
            <Subject
              placeholder="Subject"
              value={emailData.subject}
              onChange={updateField('subject')}
            />
            <Body
              placeholder="Write something..."
              value={emailData.body}
              onChange={updateField('body')}
            />
          </MainContent>

          <Footer>
            <Side>
              <Button secondary onClick={handleDelete}>
                <DeleteIcon />
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

const DraftCopy = styled.div`
  font-size: 16px;
  color: ${COLORS.purple[700]};
  font-weight: bold;
`;

const InvisibleTextarea = styled.textarea`
  display: block;
  width: 100%;
  border: none;
  resize: none;
  outline: none;

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
