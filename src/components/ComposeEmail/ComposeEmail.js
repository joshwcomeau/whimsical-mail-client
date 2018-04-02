// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';

import { COLORS } from '../../constants';

import Button from '../Button';
import ComposeEmailAddressInput from '../ComposeEmailAddressInput';

type Props = {
  toEmail: string,
  subject: string,
  body: string,
  updateField: (fieldName: string) => (val: string) => void,
  handleSend: () => void,
};

class ComposeEmail extends Component<Props> {
  render() {
    const { toEmail, subject, body, updateField, handleSend } = this.props;

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
              value={toEmail}
              onChange={updateField('toEmail')}
              label="to"
              placeholder="jane@example.com"
            />
          </Header>

          <MainContent>
            <Subject
              placeholder="Subject"
              value={subject}
              onChange={updateField('subject')}
            />
            <Body
              placeholder="Write something..."
              value={body}
              onChange={updateField('body')}
            />
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
