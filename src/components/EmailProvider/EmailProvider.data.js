// @flow
import { generators, create, createMany } from 'sharkhorse';

import { sample } from '../../utils';

import avatar1 from '../../assets/avatars/avatar-1.jpg';
import avatar2 from '../../assets/avatars/avatar-2.jpg';
import avatar3 from '../../assets/avatars/avatar-3.jpg';
import avatar4 from '../../assets/avatars/avatar-4.jpg';
import avatar5 from '../../assets/avatars/avatar-5.jpg';
import avatar6 from '../../assets/avatars/avatar-6.jpg';
import avatar7 from '../../assets/avatars/avatar-7.jpg';
import avatar8 from '../../assets/avatars/avatar-8.jpg';
import avatar9 from '../../assets/avatars/avatar-9.jpg';
import avatar10 from '../../assets/avatars/avatar-10.jpg';
import avatar11 from '../../assets/avatars/avatar-11.jpg';
import avatar12 from '../../assets/avatars/avatar-12.jpg';
import avatar13 from '../../assets/avatars/avatar-13.jpg';
import avatar14 from '../../assets/avatars/avatar-14.jpg';
import avatar15 from '../../assets/avatars/avatar-15.jpg';
import avatar16 from '../../assets/avatars/avatar-16.jpg';

import type { UserData, EmailData, BoxId } from '../../types';

const avatarSrcs = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
];

const subjects = [
  'RE: Plans next Saturday?',
  '"JS Fatigue Fatigue" Fatigue',
  "OMG I'm going to be speaking at React Europe!!",
  'Eggcelent Egg Salad recipe, dont share...',
  'FWD: sick yoyo trick',
  'Carbonated water: delicious or sinister?!',
  'Going rogue: fixing bugs under-the-table',
];

const previews = [
  "Hi Marcy, are we still on for that pool party on Saturday? I know John's already got his swimming trunks on.",
  "Anyone else getting tired of hearing people talk about being tired of hearing people talk about JS fatigue?",
  'Wooo so excited, will be talking about Whimsy at React Europe.',
  "Ok Tom, I'm warning you: This Egg Salad recipe will BLOW. YOUR. MIND!! It's a family secret so please NO SOCIAL MEDIA",
  'Check out this SICK yoyo trick. Wow!',
  "What's the deal with carbonated water, eh? Is it actually just carbon in water or are those bubbles up to something",
  "Hey peeps, keep this underground but I'm GOING ROGUE and fixing bugs outside the sprint!?!!!!",
];

const UserFactory = {
  firstName: generators.name().first(),
  lastName: generators.name().last(),
  email: generators.email(),
};

const EmailFactory = {
  id: generators.sequence(),
  from: UserFactory,

  body: generators.lorem().paragraphs(6),
};

const BOX_IDS: Array<BoxId> = ['inbox', 'outbox', 'drafts'];

export const getRandomAvatar = () => avatar16;

export const generateUser = (overrides: any = {}) => {
  const factoryUser = create(UserFactory);

  return {
    name: `${factoryUser.firstName} ${factoryUser.lastName}`,
    email: factoryUser.email,
    avatarSrc: sample(avatarSrcs),
    ...overrides,
  };
};

export const generateData = (
  userData: UserData,
  num: number,
  overrides: any = {}
): Map<number, EmailData> => {
  let time = new Date();

  const data = createMany(EmailFactory, num).map((data, i) => {
    const boxId = BOX_IDS[i % 3];

    const subject = subjects[i % subjects.length];
    const body = previews[i % previews.length] + '\n' + data.body;
    const avatarSrc = avatarSrcs[i % avatarSrcs.length];

    time -= Math.random() * 10000000;

    const generatedContact: UserData = {
      name: `${data.from.firstName} ${data.from.lastName}`,
      email: data.from.email,
      avatarSrc,
    };

    return {
      id: data.id,
      boxId,
      from: boxId === 'inbox' ? generatedContact : userData,
      to: boxId === 'inbox' ? userData : generatedContact,
      timestamp: time,
      subject,
      body,
      unread: false,
      ...overrides,
    };
  });

  // Sharkhorse's factories return an array, but I'd like to keep my data in a
  // map, to simulate a database. Map constructors take an array of tuples,
  // with the ID and the item: [ [1, email1], [2, email2], ...]
  return new Map(data.map(item => [item.id, item]));
};
