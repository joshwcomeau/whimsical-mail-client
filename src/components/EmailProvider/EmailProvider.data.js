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
import avatarWheeler from '../../assets/avatars/wheeler.jpg';
import avatarDodds from '../../assets/avatars/dodds.jpg';
import avatarNickyCase from '../../assets/avatars/nickycase.jpg';
import avatarKermit from '../../assets/avatars/kermit.gif';
import avatarHydroQuebec from '../../assets/avatars/hydro-quebec.jpg';

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
  'Anyone else getting tired of hearing people talk about being tired of hearing people talk about JS fatigue?',
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
  num: number
): Map<number, EmailData> => {
  let time = new Date();

  const inboxEmails = [
    {
      id: 'b',
      boxId: 'inbox',
      to: userData,
      from: {
        name: 'Gary Samsonite',
        email: 'gary@samsoniteagricultural.com',
        avatarSrc: avatar1,
      },
      timestamp: time - 4000000,
      subject: 'Goat-taming kit MIA',
      body:
        "Greetings, I ordered one of your goat taming kits last week, and I notice it hasn't been shipped yet. I don't have time for this kind of behavior, please let me know when the transaction will be complete.\n\nThanks,\nGary Sampsonite",
    },
    {
      id: 'c',
      boxId: 'inbox',
      to: userData,
      from: {
        name: 'Hydro Québec',
        email: 'no-reply@hydroquebec.qc.ca',
        avatarSrc: avatarHydroQuebec,
      },
      timestamp: time - 8500000,
      subject: 'Your bill is ready',
      body:
        'Hello,\n\nYour electricity bill is ready. Please pay $150 by June 2nd.',
    },
    {
      id: 'd',
      boxId: 'inbox',
      to: userData,
      from: {
        name: 'Helen George',
        email: 'helen@gmail.com',
        avatarSrc: avatar2,
      },
      timestamp: time - 12500000,
      subject: '12 MILLION USD TO HUMANITARIAN MISSION HELP NEEDED',
      body:
        'GOOD DAY.\n\nURGENT - HELP ME DISTRIBUTE MY $12 MILLION TO HUMANITARIAN.\n\nTHIS MAIL MIGHT COME TO YOU AS A SURPRISE AND THE TEMPTATION TO IGNORE IT AS UNSERIOUS COULD COME INTO YOUR MIND BUT PLEASE CONSIDER IT A DIVINE WISH AND ACCEPT IT WITH A DEEP SENSE OF HUMILITY. I AM MRS HELEN GEORGE AND I AM A 61 YEARS OLD WOMAN. I AM A SOUTH AFRICAN MARRIED TO A SIERRA LEONIA.\n\nI WAS THE PRESIDENT/CEO OF OIL COMPANY INTERNATIONAL-AN OIL SERVICING COMPANY IN JOHANNESBURG. I WAS ALSO MARRIED WITH NO CHILD.\n\nMY HUSBAND DIED 3 YEARS AGO. BEFORE THIS HAPPENED MY BUSINESS AND CONCERN FOR MAKING MONEY WAS ALL I WAS LIVING FOR AND I NEVER REALLY CARED ABOUT OTHER PEOPLE. BUT SINCE THE LOSS OF MY HUSBAND AND ALSO BECAUSE I HAD HAVE NO CHILD TO CALL MY OWN, I HAVE FOUND A NEW DESIRE TO ASSIST THE HELPLESS, I HAVE BEEN HELPING ORPHANS IN ORPHANAGES/MOTHERLESS OMES/HUMANITARIANS. I HAVE DONATED SOME MONEY TO ORPHANS IN SUDAN,ETHIOPIA, CAMEROON, SPAIN, AUSTRIA, GERMANY AND SOME ASIAN COUNTRIES.\n\nIN SUMMARY:- I HAVE 12,000,000.00 (TWELVE MILLION) U. S. DOLLARS WHICH I DEPOSITED IN A SECURITY COMPANY IN COTONOU BENIN REPUBLIC AS A FAMILY TREASURE & ARTEFACTS, PLEASE I WANT YOU TO NOTE THAT THE SECURITY COMPANY DOES NOT KNOW THE REAL CONTENT TO BE MONEY AND I WANT YOU TO ASSIST ME IN CLAIMING THE CONSIGNMENT & DISTRIBUTING THE MONEY TO CHARITY ORGANIZATIONS, I AGREE TO REWARD YOU WITH PART OF THE MONEY FOR YOUR ASSISTANCE, KINDNESS AND PARTICIPATION IN THIS GODLY PROJECT. BEFORE I BECAME ILL, I KEPT $12 MILLION IN A LONG-TERM DEPOSIT IN A SECURITY COMPANY WHICH I DECLARED AS A FAMILY TREASURE ARTIFIARTS.I AM IN THE HOSPITAL WHERE I HAVE BEEN UNDERGOING TREATMENT FOR OESOPHAGEAL CANCER AND MY DOCTORS HAVE TOLD ME THAT I HAVE ONLY A FEW MONTHS TO LIVE. IT IS MY LAST WISH TO SEE THIS MONEY DISTRIBUTED TO CHARITY ORGANIZATIONS.',
    },
    {
      id: 'e',
      boxId: 'inbox',
      to: userData,
      from: {
        name: 'Kent C. Dodds',
        email: 'kent@email.address',
        avatarSrc: avatarDodds,
      },
      timestamp: time - 27000000,
      subject: 'Mixing Component Patterns',
      body:
        'This last week I gave three workshops at Frontend Masters:\n\n-⚛️ 💯 Advanced React Patterns\n-📚 ⚠️ Testing Practices and Principles\n-⚛️ ⚠️ Testing React Applications\n\nIf you’re a Frontend Masters subscriber you can watch the unedited version of these courses now. Edited courses should be available for these soon.',
    },
    {
      id: 'f',
      boxId: 'inbox',
      to: userData,
      from: {
        name: 'Nicky Case',
        email: 'ncase@email.address',
        avatarSrc: avatarNickyCase,
      },
      timestamp: time - 50000000,
      subject: 'How do we learn? A zine.',
      body:
        'So, you want to understand the world, and/or help others understand the world. Sadly, there are a lot of misconceptions about how people learn. Thankfully, COGNITIVE SCIENCE is showing us what _really_ works! And the first, core idea to get is...',
    },
    {
      id: 'g',
      boxId: 'inbox',
      to: userData,
      from: {
        name: 'Kermit',
        email: 'kermit@frog.com',
        avatarSrc: avatarKermit,
      },
      timestamp: time - 75000000,
      subject: 'Ribbit, ribbit, ribbit',
      body:
        'Ribbit ribbit, croaaaak yip ribbit ribbit. Riiibit ribit ribbbbbit. Ribbit.',
    },
  ];

  let otherBoxEmails = createMany(EmailFactory, 20).map((data, i) => {
    const boxId = i % 2 === 0 ? 'outbox' : 'drafts';

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
    };
  });

  const emails = [...inboxEmails, ...otherBoxEmails];

  // Sharkhorse's factories return an array, but I'd like to keep my data in a
  // map, to simulate a database. Map constructors take an array of tuples,
  // with the ID and the item: [ [1, email1], [2, email2], ...]
  return new Map(emails.map((item) => [item.id, item]));
};
