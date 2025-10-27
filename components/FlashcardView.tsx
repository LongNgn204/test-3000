import React, { useState, useEffect, useMemo } from 'react';
import type { Word, Category, StudyProgress, StudyRecord, CEFRLevel } from '../types';
import Flashcard from './Flashcard';
import * as srsService from '../services/srsService';
import { CEFR_LEVEL_MAP } from '../cefr';

interface FlashcardViewProps {
  words: Word[];
  categories: Category[];
  studyProgress: StudyProgress;
  onUpdateStudyProgress: (wordEnglish: string, performance: 'again' | 'good' | 'easy') => void;
  onResetStudyProgress: (wordKeys: string[]) => void;
  initialStudyFilter: 'review' | 'new' | null;
  onInitialFilterConsumed: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const FlashcardView: React.FC<FlashcardViewProps> = ({ 
    words, 
    categories, 
    studyProgress,
    onUpdateStudyProgress,
    onResetStudyProgress,
    initialStudyFilter,
    onInitialFilterConsumed
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [studyFilter, setStudyFilter] = useState<'review' | 'new'>('review');
  const [wordSet, setWordSet] = useState<Word[]>([]);

  useEffect(() => {
    if (initialStudyFilter) {
      setStudyFilter(initialStudyFilter);
      onInitialFilterConsumed();
    }
  }, [initialStudyFilter, onInitialFilterConsumed]);

  const categoryFilteredWords = useMemo(() => {
    if (selectedCategory === 'all') return words;
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.words : [];
  }, [words, categories, selectedCategory]);

  const { wordsToReview, newWords } = useMemo(() => {
    return srsService.getWordsForSession(categoryFilteredWords, studyProgress);
  }, [categoryFilteredWords, studyProgress]);

  const finalFilteredWords = useMemo(() => {
      if (studyFilter === 'review') {
          return wordsToReview;
      }
      return newWords; // studyFilter === 'new'
  }, [studyFilter, wordsToReview, newWords]);
  
  const studyCounts = useMemo(() => {
      const { wordsToReview: review, newWords: news } = srsService.getWordsForSession(categoryFilteredWords, studyProgress);
      return { 
          review: review.length, 
          new: news.length,
          total: categoryFilteredWords.length
      };
  }, [categoryFilteredWords, studyProgress]);
  
  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      const level = category.level;
      if (!acc[level]) acc[level] = [];
      acc[level].push(category);
      return acc;
    }, {} as Record<CEFRLevel, Category[]>);
  }, [categories]);

  const sortedLevels = useMemo(() => Object.keys(groupedCategories).sort((a, b) => {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levelOrder.indexOf(a) - levelOrder.indexOf(b);
  }) as CEFRLevel[], [groupedCategories]);


  useEffect(() => {
    setWordSet(shuffleArray(finalFilteredWords));
    setCurrentIndex(0);
  }, [finalFilteredWords]);

  const handleShuffle = () => {
    setWordSet(shuffleArray(finalFilteredWords));
    setCurrentIndex(0);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
        if (wordSet.length === 0) return 0;
        return (prevIndex + 1) % wordSet.length;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
        if (wordSet.length === 0) return 0;
        return (prevIndex - 1 + wordSet.length) % wordSet.length
    });
  };

  const handleAnswer = (word: Word, performance: 'again' | 'good' | 'easy') => {
    onUpdateStudyProgress(word.english, performance);
    setTimeout(() => {
        // Remove the answered word from the current session's set
        setWordSet(prevSet => prevSet.filter(w => w.english !== word.english));
        // The index will automatically adjust or reset if it goes out of bounds
        setCurrentIndex(prevIndex => Math.min(prevIndex, wordSet.length - 2));
    }, 300);
  };
  
  const handleReset = () => {
      const categoryName = selectedCategory === 'all' 
        ? 'tất cả các từ' 
        : `chủ đề "${categories.find(c => c.id === selectedCategory)?.name}"`;

      if (confirm(`Bạn có chắc muốn xoá tiến trình học cho ${categoryName} không?`)) {
          const wordsToReset = categoryFilteredWords.map(w => w.english);
          onResetStudyProgress(wordsToReset);
      }
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [wordSet.length]);

  if (words.length === 0) {
    return <div className="text-center p-8">Không có từ nào để hiển thị theo tìm kiếm của bạn.</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-3xl text-center mb-6 space-y-4 bg-white p-4 rounded-lg shadow-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="category-select" className="block text-sm font-medium text-slate-700 mb-1">Chủ đề:</label>
                    <select 
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả ({words.length} từ)</option>
                        {sortedLevels.map(level => (
                          <optgroup key={level} label={CEFR_LEVEL_MAP[level].name}>
                            {groupedCategories[level].map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </optgroup>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="study-filter" className="block text-sm font-medium text-slate-700 mb-1">Chế độ học:</label>
                    <select 
                        id="study-filter"
                        value={studyFilter}
                        onChange={(e) => setStudyFilter(e.target.value as any)}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="review">Ôn tập hôm nay ({studyCounts.review})</option>
                        <option value="new">Học từ mới ({studyCounts.new})</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-center items-center gap-4 pt-4 border-t">
                 {wordSet.length > 0 && (
                    <p className="text-lg font-semibold text-slate-600">
                        Còn lại: {wordSet.length} thẻ
                    </p>
                )}
                 <button 
                    onClick={handleReset}
                    className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-md"
                    title="Xóa tiến trình học"
                 >
                    Xóa tiến trình
                 </button>
            </div>
        </div>
      
      {wordSet.length > 0 ? (
        <>
            <div className="w-full max-w-2xl h-[400px] md:h-[450px] flex items-center justify-center">
                <Flashcard 
                  key={wordSet[currentIndex].english}
                  word={wordSet[currentIndex]} 
                  onAnswer={handleAnswer}
                  studyRecord={studyProgress[wordSet[currentIndex].english]}
                />
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 w-full max-w-2xl">
                <button
                onClick={goToPrevious}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-lg shadow-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Trước
                </button>
                <button
                    onClick={handleShuffle}
                    className="px-6 py-3 bg-white border border-slate-300 rounded-lg shadow-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Xáo trộn
                </button>
                <button
                onClick={goToNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-lg shadow-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                Sau
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        </>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md mt-4">
            <h3 className="text-xl font-semibold text-slate-700">Tuyệt vời!</h3>
            <p className="text-slate-500 mt-2">
                Bạn đã hoàn thành tất cả các thẻ trong phiên học này. <br/>
                Hãy quay lại vào ngày mai để ôn tập tiếp nhé!
            </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardView;