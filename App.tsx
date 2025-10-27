import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import Header from './components/Header';
import { WORD_CATEGORIES, ALL_WORDS } from './constants';
import { CHALLENGES } from './challengesData';
import type { User, StudyProgress, ViewMode, PlacementTestResult, StudyRecord, DailyProgress, DailyGoal } from './types';
import Footer from './components/Footer';
import * as api from './services/api';
import * as srsService from './services/srsService';

// Lazy load components for better performance
const Sidebar = lazy(() => import('./components/Sidebar'));
const WordList = lazy(() => import('./components/WordList'));
const FlashcardView = lazy(() => import('./components/FlashcardView'));
const QuizView = lazy(() => import('./components/QuizView'));
const AIStoryView = lazy(() => import('./components/AIStoryView'));
const DashboardView = lazy(() => import('./components/DashboardView'));
const ConversationView = lazy(() => import('./components/ConversationView'));
const PlacementTestView = lazy(() => import('./components/PlacementTestView'));
const PlacementTestResultView = lazy(() => import('./components/PlacementTestResultView'));
const PronunciationView = lazy(() => import('./components/PronunciationView'));
const GrammarView = lazy(() => import('./components/GrammarView'));
const ListeningView = lazy(() => import('./components/ListeningView'));
const AdvancedGrammarView = lazy(() => import('./components/AdvancedGrammarView'));
const AuthView = lazy(() => import('./components/AuthView'));
const ReadingRoomView = lazy(() => import('./components/ReadingRoomView'));
const AIWritingView = lazy(() => import('./components/AIWritingView'));
const AIRolePlayView = lazy(() => import('./components/AIRolePlayView'));
const WelcomeView = lazy(() => import('./components/WelcomeView'));
const LandingView = lazy(() => import('./components/LandingView'));
const LeaderboardView = lazy(() => import('./components/LeaderboardView'));
const ChallengesView = lazy(() => import('./components/ChallengesView'));
const VideoLessonsView = lazy(() => import('./components/VideoLessonsView'));
const CommunityForumView = lazy(() => import('./components/CommunityForumView'));


const Loader: React.FC = () => (
    <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-14 h-14 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(WORD_CATEGORIES[0]?.id || '');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>({});
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [initialFlashcardFilter, setInitialFlashcardFilter] = useState<'review' | 'new' | null>(null);
  const [testResultToShow, setTestResultToShow] = useState<PlacementTestResult | null>(null);


  const mainContentRef = useRef<HTMLDivElement>(null);

  const initializeDailyProgress = (user: User): DailyProgress => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const lastProgress = user.dailyProgress;
      let newStreak = 1;

      if (lastProgress) {
          if (lastProgress.date === today) {
              return lastProgress;
          }
          if (lastProgress.date === yesterdayStr) {
              const allGoalsMet = lastProgress.goals.every(g => g.current >= g.target);
              if (allGoalsMet) {
                  newStreak = lastProgress.streak + 1;
              } else {
                  newStreak = 0;
              }
          } else {
              newStreak = 1;
          }
      }

      const newGoals: DailyGoal[] = [
          { id: 'g1', description: 'Học 10 từ mới', type: 'learn_new', target: 10, current: 0 },
          { id: 'g2', description: 'Ôn tập 15 từ SRS', type: 'review_srs', target: 15, current: 0 },
          { id: 'g3', description: 'Hoàn thành 1 bài đọc có hướng dẫn', type: 'complete_reading', target: 1, current: 0 },
          { id: 'g4', description: 'Hoàn thành 1 bài nghe có hướng dẫn', type: 'complete_listening', target: 1, current: 0 },
          { id: 'g5', description: 'Luyện giao tiếp 1 lần', type: 'complete_conversation', target: 1, current: 0 },
          { id: 'g6', description: 'Hoàn thành 1 tình huống nhập vai', type: 'complete_roleplay', target: 1, current: 0 },
          { id: 'g7', description: 'Hoàn thành 1 thử thách', type: 'complete_challenge', target: 1, current: 0 },
          { id: 'g8', description: 'Xem 1 bài giảng video', type: 'complete_video_lesson', target: 1, current: 0 },
          { id: 'g9', description: 'Đăng 1 bài trong diễn đàn', type: 'post_in_forum', target: 1, current: 0 },
      ];

      return { date: today, streak: newStreak, goals: newGoals };
  };

  useEffect(() => {
    const verifySession = async () => {
        const { user } = await api.checkSession();
        if (user) {
            handleLoginSuccess(user);
        } else {
            setViewMode('landing');
        }
    };
    verifySession();
  }, []);

  const handleLoginSuccess = (user: User) => {
      setCurrentUser(user);
      setStudyProgress(user.studyProgress || {});
      const newDailyProgress = initializeDailyProgress(user);
      setDailyProgress(newDailyProgress);
      api.updateDailyProgress(user.name, newDailyProgress);
      setViewMode('dashboard');
  };

  const handleRegister = async (name: string, password: string): Promise<{ success: boolean, message?: string }> => {
    const result = await api.register(name, password);
    if (result.success && result.user) {
        setCurrentUser(result.user);
        setStudyProgress(result.user.studyProgress || {});
        const newDailyProgress = initializeDailyProgress(result.user);
        setDailyProgress(newDailyProgress);
        api.updateDailyProgress(result.user.name, newDailyProgress);
        setViewMode('welcome');
    }
    return result;
  };

  const handleLogin = async (name: string, password: string): Promise<{ success: boolean, message?: string }> => {
    const result = await api.login(name, password);
    if (result.success && result.user) {
        handleLoginSuccess(result.user);
        return { success: true };
    }
    return { success: false, message: result.message };
  };

  const handlePlacementTestSubmit = (result: PlacementTestResult) => {
      setTestResultToShow(result);
      setViewMode('placement-test-result');
  };

  const handlePlacementTestComplete = async () => {
    if (!currentUser) return;
    
    // Default to A2 if AI fails or result is missing
    const finalLevel = testResultToShow?.level || 'A2';
    const finalResult = testResultToShow || { level: 'A2', analysis: { score: 0, totalQuestions: 0, incorrectQuestions: [], performanceByLevel: {} } };


    const result = await api.completePlacementTest(currentUser.name, { ...finalResult, level: finalLevel });

    if (result.success && result.user) {
        setCurrentUser(result.user); // Update user with new level
        setStudyProgress(result.user.studyProgress || {});
        // Daily progress remains the same for the day
    } else {
        console.error("Failed to complete placement test:", result.message);
        // Don't kick user out, just show an error or stay on the page
    }

    setTestResultToShow(null);
    setViewMode('dashboard'); // Go back to dashboard to see updated level
  };

  const handleWelcomeComplete = () => {
    setViewMode('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setStudyProgress({});
    setDailyProgress(null);
    setViewMode('landing');
  };
  
  const handleUpdateStudyProgress = async (wordEnglish: string, performance: 'again' | 'good' | 'easy') => {
    if (!currentUser) return;

    const currentRecord = studyProgress[wordEnglish] || srsService.getInitialRecord();
    const isNewWord = !studyProgress[wordEnglish];
    const newRecord = srsService.calculateNextReview(currentRecord, performance);
    
    const newProgress = { ...studyProgress, [wordEnglish]: newRecord };
    setStudyProgress(newProgress);
    await api.updateProgress(currentUser.name, newProgress);

    if (performance !== 'again' && isNewWord) {
      handleGoalUpdate('learn_new', 1);
    }
    handleGoalUpdate('review_srs', 1);
  };

  const handleGoalUpdate = async (type: DailyGoal['type'], amount: number) => {
    if (!currentUser) return;
    let updatedUser = { ...currentUser };
    let userChanged = false;

    // Daily Goals
    if (dailyProgress) {
        const newGoals = dailyProgress.goals.map(goal => {
            if (goal.type === type) {
                return { ...goal, current: Math.min(goal.target, goal.current + amount) };
            }
            return goal;
        });
        const newDailyProgress = { ...dailyProgress, goals: newGoals };
        setDailyProgress(newDailyProgress);
        await api.updateDailyProgress(currentUser.name, newDailyProgress);
    }

    // Weekly Challenges
    const newChallengeProgress = { ...(currentUser.challengeProgress || {}) };
    CHALLENGES.forEach(challenge => {
        if (challenge.goalType === type) {
            const progress = newChallengeProgress[challenge.id] || { current: 0, completed: false };
            if (!progress.completed) {
                progress.current = Math.min(challenge.target, progress.current + amount);
                if (progress.current >= challenge.target) {
                    progress.completed = true;
                    // Also update daily challenge goal if one is completed
                    handleGoalUpdate('complete_challenge', 1);
                }
                newChallengeProgress[challenge.id] = progress;
                userChanged = true;
            }
        }
    });

    if (userChanged) {
        updatedUser.challengeProgress = newChallengeProgress;
        setCurrentUser(updatedUser);
        await api.updateUser(updatedUser);
    }
  }
  
  const handleResetStudyProgress = async (wordKeys: string[]) => {
      if (!currentUser) return;
      const newProgress = { ...studyProgress };
      wordKeys.forEach(key => {
          delete newProgress[key];
      });
      setStudyProgress(newProgress);
      await api.updateProgress(currentUser.name, newProgress);
  };

  const navigateTo = (mode: ViewMode, options?: { initialFilter: 'review' | 'new' }) => {
    if (options?.initialFilter) {
      setInitialFlashcardFilter(options.initialFilter);
    } else {
      setInitialFlashcardFilter(null);
    }
    setViewMode(mode);
    setIsMobileSidebarOpen(false);
  };

  const filteredWords = useMemo(() => {
      if (!searchQuery) return ALL_WORDS;
      const lowercasedQuery = searchQuery.toLowerCase();
      return ALL_WORDS.filter(word =>
          word.english.toLowerCase().includes(lowercasedQuery) ||
          word.vietnamese.toLowerCase().includes(lowercasedQuery)
      );
  }, [searchQuery]);


  const renderView = () => {
    // Logged-in views
    if(currentUser) {
        switch(viewMode) {
          case 'dashboard':
            return <DashboardView 
                      currentUser={currentUser} 
                      studyProgress={studyProgress}
                      dailyProgress={dailyProgress}
                      categories={WORD_CATEGORIES}
                      navigateTo={navigateTo}
                   />;
          case 'welcome':
            return <WelcomeView currentUser={currentUser} onComplete={handleWelcomeComplete} />;
          case 'story':
            return <AIStoryView words={ALL_WORDS} studyProgress={studyProgress} onGoalUpdate={() => {}} />;
          case 'conversation':
            return <ConversationView allWords={ALL_WORDS} studyProgress={studyProgress} currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_conversation', 1)} />;
          case 'pronunciation':
            return <PronunciationView words={ALL_WORDS} studyProgress={studyProgress} onGoalUpdate={() => handleGoalUpdate('complete_pronunciation', 1)} />;
          case 'grammar':
            return <GrammarView />;
          case 'listening':
            return <ListeningView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_listening', 1)}/>;
          case 'advanced-grammar':
            return <AdvancedGrammarView currentUser={currentUser} onGoalUpdate={() => {}} />;
          case 'reading':
            return <ReadingRoomView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_reading', 1)} />;
          case 'writing':
            return <AIWritingView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_writing', 1)} />;
          case 'role-play':
            return <AIRolePlayView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_roleplay', 1)} />;
          case 'leaderboard':
            return <LeaderboardView currentUser={currentUser} />;
          case 'challenges':
            return <ChallengesView currentUser={currentUser} />;
           case 'video-lessons':
            return <VideoLessonsView onGoalUpdate={() => handleGoalUpdate('complete_video_lesson', 1)} />;
          case 'community-forum':
            return <CommunityForumView onGoalUpdate={() => handleGoalUpdate('post_in_forum', 1)} />;
          case 'placement-test':
            return <PlacementTestView onTestSubmit={handlePlacementTestSubmit} />;
          case 'placement-test-result':
            return <PlacementTestResultView result={testResultToShow!} onComplete={handlePlacementTestComplete} />;
          case 'flashcard':
            return <FlashcardView 
                  words={filteredWords} 
                  categories={WORD_CATEGORIES}
                  studyProgress={studyProgress}
                  onUpdateStudyProgress={handleUpdateStudyProgress}
                  onResetStudyProgress={handleResetStudyProgress}
                  initialStudyFilter={initialFlashcardFilter}
                  onInitialFilterConsumed={() => setInitialFlashcardFilter(null)}
                />;
          case 'quiz':
             return <QuizView allWords={ALL_WORDS} wordsForQuiz={filteredWords} categories={WORD_CATEGORIES} onGoalUpdate={() => handleGoalUpdate('complete_quiz', 1)} />;
          case 'list':
          default:
            return <WordList 
                      categories={WORD_CATEGORIES}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      activeCategory={activeCategory}
                      setActiveCategory={setActiveCategory}
                      mainContentRef={mainContentRef}
                    />
        }
    }
    
    // Public/Auth views
    switch(viewMode) {
        case 'auth':
            return <AuthView onLogin={handleLogin} onRegister={handleRegister} />;
        case 'landing':
        default:
            return <LandingView onStart={() => setViewMode('auth')} />;
    }
  };

  if (!currentUser) {
    return (
        <Suspense fallback={<div id="initial-loader"><div className="spinner"></div></div>}>
            {renderView()}
        </Suspense>
    );
  }

  // Main App Layout for logged-in user
  return (
    <div className={`min-h-screen text-slate-800 flex ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
      <Suspense fallback={<div></div>}>
        <Sidebar 
          viewMode={viewMode} 
          navigateTo={navigateTo}
          currentUser={currentUser}
          onLogoutClick={handleLogout}
        />
      </Suspense>
      <div 
        className="fixed inset-0 bg-black/50 z-30 lg:hidden sidebar-overlay opacity-0 pointer-events-none transition-opacity"
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>

      <div className="flex flex-col flex-1 lg:pl-64">
        <Header 
          viewMode={viewMode}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<Loader />}>
            <div className="flex-grow w-full max-w-screen-2xl mx-auto flex flex-col">
              {renderView()}
            </div>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;