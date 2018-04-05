// @flow
import type { UserData } from '../types';

export const parseEmailString = (str: string): UserData => {
  // Emails are written as "First Last <email@domain.com>" in the compose
  // modal.
  // NOTE: In a real app, there would be some sort of tagging system with
  // contact-list tie-in, but for this demo I'm just assuming anything the
  // user writes is valid.
  const matcher = /(.+)\s*<(.+)>/i;

  const match = str.match(matcher);

  if (!match) {
    throw new Error('Unrecognized email format :(');
  }

  const [, name, email] = match;

  return { name, email };
};
