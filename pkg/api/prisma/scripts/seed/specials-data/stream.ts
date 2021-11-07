import type { Prisma } from '@prisma/client'
import { revisionIds } from './basic'

const messageIds = {
  id1: 'ce2dd590-ffad-cd32-01c2-06fd4f009ff3',
  id2: '69f49864-5fd4-b3e5-595c-7b1039edf144',
  id3: '03cde166-fcab-9250-c80f-974d19f3bbbc',
  id4: 'aa4e6b16-54ce-37a1-249f-575479e52264',
}
const replyIds = {
  id1: '70161ff6-c2f8-e8a5-fb4f-e01da08cbe10',
  id2: 'e029c93b-9868-7b05-7342-736a466618c9',
  id3: '5110891e-0635-f7d5-1353-8bc055451c25',
  id4: 'eee7e425-d589-e06c-c3f6-6098bb8840bf',
}

export const messageData: Prisma.MessageCreateInput[] = [
  {
    messageId: messageIds.id1,
    userName: 'Sally Brown',
    content:
      'Sally is the complete pragmatist. There is a certain charm when she fractures the language: ‘By golly, if any centimeters come in this room, I’ll step on them!',
    revision: {
      connect: {
        revisionId: revisionIds.id1,
      },
    },
  },
  {
    messageId: messageIds.id2,
    userName: 'Charlie Brown',
    content:
      'Charlie Brown must be the one who suffers because he’s a caricature of the average person. Most of us are much more acquainted with losing than winning. Winning is great, but it isn’t funny',
    revision: {
      connect: {
        revisionId: revisionIds.id1,
      },
    },
  },
  {
    messageId: messageIds.id3,
    userName: 'Schroeder',
    content:
      'I kind of like Schroeder. He’s fairly down to earth, but he has his problems too. He has to play on the painted black piano keys, and he thinks Beethoven was the first President of the United States.',
    revision: {
      connect: {
        revisionId: revisionIds.id2,
      },
    },
  },
  {
    messageId: messageIds.id4,
    userName: 'Peppermint Patty',
    content:
      'Peppermint Patty, the tomboy, is forthright, doggedly loyal, with a devastating singleness of purpose, the part of us that goes through life with blinders on.',
    revision: {
      connect: {
        revisionId: revisionIds.id2,
      },
    },
  },
]

export const replyData: Prisma.ReplyCreateInput[] = [
  {
    replyId: replyIds.id1,
    userName: 'Woodstock',
    content:
      'Woodstock knows that he is very small and inconsequential indeed. It’s a problem we all have. The universe boggles us…Woodstock is a lighthearted expression of that idea.',
    message: {
      connect: {
        messageId: messageIds.id1,
      },
    },
  },
  {
    replyId: replyIds.id2,
    userName: 'Marcie',
    content:
      'Marcie is one-up on Peppermint Patty in every way. She sees the truth of things, where it invariably escapes Patty. I like Marcie',
    message: {
      connect: {
        messageId: messageIds.id1,
      },
    },
  },
  {
    replyId: replyIds.id3,
    userName: 'Rerun van Pelt',
    content:
      'Lucy and Linus are the ones who named their baby brother Rerun. He doesnot hold it against them!',
    message: {
      connect: {
        messageId: messageIds.id3,
      },
    },
  },
  {
    replyId: replyIds.id4,
    userName: 'Spike',
    content:
      'In my comic strip, Snoopys brother Spike lives near this same desert town [Needles, California], where we usually see him sitting by a saguaro.',
    message: {
      connect: {
        messageId: messageIds.id4,
      },
    },
  },
]
