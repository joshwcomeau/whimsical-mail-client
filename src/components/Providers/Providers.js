// @flow
import React from 'react';

import AuthenticationProvider from '../AuthenticationProvider';
import EmailProvider from '../EmailProvider';
import ModalProvider from '../ModalProvider';
import NodeProvider from '../NodeProvider';

type Props = { children: React$Node };

// prettier-ignore
const Providers = ({ children }: Props) => (
  <AuthenticationProvider>
    <EmailProvider>
      <ModalProvider>
        <NodeProvider>
          {children}
        </NodeProvider>
      </ModalProvider>
    </EmailProvider>
  </AuthenticationProvider>
);

export default Providers;
