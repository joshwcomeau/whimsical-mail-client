export type UserData = {
  name: string,
  email: string,
  avatarSrc?: string,
};

export type EmailData = {
  id: number,
  from: UserData,
  to: UserData,
  timestamp: number,
  subject: string,
  preview: string,
  body: React$Node,
};

export type ModalId = 'compose';

export type BoxId = 'inbox' | 'outbox' | 'drafts';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
