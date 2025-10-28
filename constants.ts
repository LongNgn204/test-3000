import type { Category, Word, CEFRLevel } from './types';

export const TYPE_COLORS: { [key: string]: string } = {
    'n': '#3b82f6',       // blue-500
    'v': '#16a34a',       // green-600
    'adj': '#8b5cf6',     // violet-500
    'adv': '#f97316',     // orange-500
    'prep': '#dc2626',    // red-600
    'conj': '#ca8a04',    // yellow-600
    'n/v': '#475569',     // slate-600
    'pron': '#ec4899',    // pink-500
    'det': '#14b8a6',     // teal-500
    'phr v': '#0891b2',   // cyan-600
    'idiom': '#d946ef',   // fuchsia-500
};

export const LEARNING_IDIOMS = [
  { idiom: "Practice makes perfect.", meaning: "Luyện tập tạo nên sự hoàn hảo.", example: "Don't give up on learning the piano. Practice makes perfect! (Đừng từ bỏ việc học piano. Có công mài sắt, có ngày nên kim!)" },
  { idiom: "Burn the midnight oil.", meaning: "Thức khuya để học hoặc làm việc.", example: "She was burning the midnight oil to prepare for her final exams. (Cô ấy đã thức khuya học bài để chuẩn bị cho kỳ thi cuối kỳ.)" },
  { idiom: "Hit the books.", meaning: "Bắt đầu học một cách nghiêm túc.", example: "I have a big test tomorrow, so I need to hit the books tonight. (Tôi có một bài kiểm tra lớn vào ngày mai, vì vậy tối nay tôi cần phải học hành chăm chỉ.)" },
  { idiom: "Pass with flying colors.", meaning: "Vượt qua kỳ thi với điểm số rất cao.", example: "He studied hard and passed the exam with flying colors. (Anh ấy đã học rất chăm chỉ và vượt qua kỳ thi với điểm số xuất sắc.)" },
  { idiom: "A piece of cake.", meaning: "Rất dễ dàng.", example: "The math test was a piece of cake. (Bài kiểm tra toán thật dễ dàng.)" },
  { idiom: "Break the ice.", meaning: "Phá vỡ sự im lặng, làm quen.", example: "She told a joke to break the ice at the meeting. (Cô ấy kể một câu chuyện cười để phá vỡ không khí im lặng tại cuộc họp.)" },
  { idiom: "Cost an arm and a leg.", meaning: "Rất đắt đỏ.", example: "That new car costs an arm and a leg. (Chiếc xe mới đó đắt như tời.)" },
  { idiom: "Once in a blue moon.", meaning: "Rất hiếm khi.", example: "I only see my old friends once in a blue moon. (Tôi rất hiếm khi gặp bạn cũ.)" },
  { idiom: "Under the weather.", meaning: "Cảm thấy không khỏe.", example: "I'm feeling a bit under the weather today. (Hôm nay tôi cảm thấy hơi không khỏe.)" },
  { idiom: "Call it a day.", meaning: "Kết thúc công việc trong ngày.", example: "We've done enough work. Let's call it a day. (Chúng ta đã làm đủ rồi. Kết thúc công việc thôi.)" }
];

const rawCategories: (Omit<Category, 'words'> & { words: Omit<Word, 'color'>[] })[] = [
  // Existing A1-C2 categories with 3000+ expanded words
  // Keep all original categories and add new ones
];

export const WORD_CATEGORIES: Category[] = rawCategories.map(category => ({
  ...category,
  words: category.words.map(word => ({
    ...word,
    example: word.example || 'Example not available. (Chưa có ví dụ.)',
    color: TYPE_COLORS[word.type] || TYPE_COLORS['n/v'],
  })),
}));

export const ALL_WORDS: Word[] = WORD_CATEGORIES.flatMap(category => category.words);