// @flow
import React from 'react';

import EmailProvider from '../EmailProvider';
import ModalProvider from '../ModalProvider';

type Props = { children: React$Node };

const Providers = ({ children }: Props) => {
  // prettier-ignore
  return (
    <EmailProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </EmailProvider>
  );
};

export default Providers;
