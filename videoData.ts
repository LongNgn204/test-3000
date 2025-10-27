import type { CEFRLevel } from './types';

export interface VideoLesson {
  id: string;
  title: string;
  level: CEFRLevel;
  description: string;
  youtubeId: string;
  thumbnail: string;
}

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v1',
    title: "Mastering the Present Perfect",
    level: "B1",
    description: "Understand when and how to use the Present Perfect tense correctly with clear examples.",
    youtubeId: "i9M-h2o_sqg", // Example ID from a popular grammar channel
    thumbnail: "https://img.youtube.com/vi/i9M-h2o_sqg/mqdefault.jpg"
  },
  {
    id: 'v2',
    title: "Advanced Conditionals (Mixed)",
    level: "C1",
    description: "Learn how to mix second and third conditionals to talk about hypothetical past and present situations.",
    youtubeId: "gB14-2U1-pM", // Example ID
    thumbnail: "https://img.youtube.com/vi/gB14-2U1-pM/mqdefault.jpg"
  },
  {
    id: 'v3',
    title: "Using Phrasal Verbs Naturally",
    level: "B2",
    description: "Boost your fluency by learning common phrasal verbs and how to use them in daily conversation.",
    youtubeId: "AM-80A0y3X0", // Example ID
    thumbnail: "https://img.youtube.com/vi/AM-80A0y3X0/mqdefault.jpg"
  },
  {
    id: 'v4',
    title: "Pronunciation: The 'TH' Sound",
    level: "A2",
    description: "A practical guide to mastering the difficult 'th' sound in English (voiced and unvoiced).",
    youtubeId: "h-gOKj_2u7Q", // Example ID
    thumbnail: "https://img.youtube.com/vi/h-gOKj_2u7Q/mqdefault.jpg"
  },
  {
    id: 'v5',
    title: "Business English: Negotiations",
    level: "C1",
    description: "Key phrases and strategies for successful negotiations in a professional business environment.",
    youtubeId: "2v335h_2aAQ", // Example ID
    thumbnail: "https://img.youtube.com/vi/2v335h_2aAQ/mqdefault.jpg"
  },
  {
    id: 'v6',
    title: "Common Mistakes in Emails",
    level: "B1",
    description: "Avoid common pitfalls and write more professional and effective emails in English.",
    youtubeId: "yOfAQG-3u_k", // Example ID
    thumbnail: "https://img.youtube.com/vi/yOfAQG-3u_k/mqdefault.jpg"
  },
];
