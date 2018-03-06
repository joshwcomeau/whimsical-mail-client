// @flow
import React from 'react';

import EmailProvider from '../EmailProvider';
import NewEmailAnimationsProvider from '../NewEmailAnimationsProvider';

type Props = { children: React$Node };

const Providers = ({ children }: Props) => {
  // prettier-ignore
  return (
    <EmailProvider>
      <NewEmailAnimationsProvider>
        {children}
      </NewEmailAnimationsProvider>
    </EmailProvider>
  );
};

export default Providers;
