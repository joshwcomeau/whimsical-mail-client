export type EmailData = {
  id: number,
  from: {
    name: string,
    email: string,
    avatarSrc: string,
  },
  timestamp: number,
  subject: string,
  preview: string,
  body: React$Node,
};

export type ModalId = 'compose';

export type BoxId = 'inbox' | 'outbox' | 'drafts';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// TODO: Delete
export type FoldId = 'send' | 'save' | 'erase';
