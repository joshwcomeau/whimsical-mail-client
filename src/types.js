export type UserData = {
  name?: string,
  email: string,
  avatarSrc?: string,
};

export type EmailData = {
  id: number,
  from: UserData,
  to: UserData,
  timestamp: number,
  subject: string,
  body: React$Node,
  read: boolean,
};

export type ComposingEmailData = {
  ...$Shape<EmailData>,
  toEmail: string,
};

export type ModalId = 'compose';

export type BoxId = 'inbox' | 'outbox' | 'drafts';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
