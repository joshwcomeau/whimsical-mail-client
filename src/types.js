export type LetterData = {
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
