// @flow
import React from 'react';

import EmailProvider from '../EmailProvider';
import ModalProvider from '../ModalProvider';
import NodeProvider from '../NodeProvider';

type Props = { children: React$Node };

const Providers = ({ children }: Props) => {
  // prettier-ignore
  return (
    <EmailProvider>
      <ModalProvider>
        <NodeProvider>
          {children}
        </NodeProvider>
      </ModalProvider>
    </EmailProvider>
  );
};

export default Providers;
