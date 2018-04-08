// @flow
import type { UserData } from '../types';

export const parseEmailString = (str: string): UserData => {
  // Emails are written as "First Last <email@domain.com>" in the compose
  // modal.
  // NOTE: In a real app, there would be some sort of tagging system with
  // contact-list tie-in, but for this demo I'm just assuming anything the
  // user writes is valid.
  const matcher = /(.+)\s*<(.+)>/i;

  if (!str) {
    return { name: '', email: ''};
  }

  const match = str.match(matcher);

  if (!match) {
    return { name: str.split('@')[0], email: str };
  }

  const [, name, email] = match;

  return { name, email };
};
