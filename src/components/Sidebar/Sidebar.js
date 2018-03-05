import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import { MailConsumer } from '../MailProvider';
import MailListItem from '../MailListItem';
import HighlightRectangle from '../HighlightRectangle';
import SidebarHeader from '../SidebarHeader';

class Sidebar extends Component {
  static defaultProps = {
    itemHeight: 100,
    headerHeight: 50,
  };

  render() {
    const { itemHeight, headerHeight } = this.props;

    return (
      <Wrapper style={{ height: window.innerHeight }}>
        <SidebarHeaderWrapper>
          <SidebarHeader height={50} />
        </SidebarHeaderWrapper>

        <Background />

        <MailConsumer>
          {({
            mailArray,
            selectedLetterId,
            selectedLetterIndex,
            selectLetter,
          }) => (
            <Fragment>
              <MailList>
                {mailArray.map(letter => (
                  <MailListItem
                    key={letter.id}
                    height={itemHeight}
                    letter={letter}
                    isSelected={letter.id === selectedLetterId}
                    handleClick={() => selectLetter(letter.id)}
                  />
                ))}
              </MailList>
              <HighlightRectangle
                height={itemHeight}
                offset={itemHeight * selectedLetterIndex + headerHeight}
              />
            </Fragment>
          )}
        </MailConsumer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 300px;
  height: 100%;
`;

const SidebarHeaderWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.gray[200]};
`;

const MailList = styled.div`
  position: relative;
  z-index: 1;
`;

const MailListActiveBackground = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  height: ${props => props.height}px;
  width: 100%;
  background: white;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  transform: translateY(${props => props.height * props.position}px);
  transition: transform ${props => props.position * 200 + 200}ms;
`;

export default Sidebar;
