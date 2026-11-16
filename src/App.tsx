import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TERMS_DATA, Term, CategoryId } from './data/terms';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { FlashCard } from './components/FlashCard';
import { CardControls } from './components/CardControls';
import { GlossaryList } from './components/GlossaryList';
import { CheckCircle2, RotateCcw, Sparkles, AlertCircle, Bookmark, ArrowRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY_PROGRESS = 'baketerms_user_progress_v1';
const STORAGE_KEY_BOOKMARKS = 'baketerms_user_bookmarks_v1';

export default function App() {
  // State from localStorage
  const [userProgress, setUserProgress] = useState<Record<string, 'known' | 'unknown'>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'unknown_only' | 'bookmarked'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [deckOrder, setDeckOrder] = useState<Term[]>(TERMS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<number>(0); // 1 = next, -1 = prev, 0 = reset
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
    } catch (e) {
      console.error(e);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  // Filtered list of cards based on Category & Filter Mode
  const filteredDeck = useMemo(() => {
    return deckOrder.filter((term) => {
      // Category filter
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }
      // Mode filter
      if (filterMode === 'unknown_only' && userProgress[term.id] !== 'unknown') {
        return false;
      }
      if (filterMode === 'bookmarked' && !bookmarks.includes(term.id)) {
        return false;
      }
      return true;
    });
  }, [deckOrder, selectedCategory, filterMode, userProgress, bookmarks]);

  // Safeguard index on list changes
  useEffect(() => {
    if (currentIndex >= filteredDeck.length) {
      setCurrentIndex(Math.max(0, filteredDeck.length - 1));
    }
    setIsFlipped(false);
  }, [filteredDeck.length, currentIndex]);

  // Overall Statistics across all terms
  const stats = useMemo(() => {
    const total = TERMS_DATA.length;
    let known = 0;
    let unknown = 0;

    TERMS_DATA.forEach((term) => {
      const st = userProgress[term.id];
      if (st === 'known') known++;
      else if (st === 'unknown') unknown++;
    });

    const unlearned = total - known - unknown;
    return {
      total,
      known,
      unknown,
      unlearned,
      bookmarked: bookmarks.length,
    };
  }, [userProgress, bookmarks]);

  // Current Card
  const currentCard = filteredDeck[currentIndex];

  // Actions
  const handleToggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2000);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < filteredDeck.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredDeck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleMarkKnown = useCallback(() => {
    if (!currentCard) return;
    setUserProgress((prev) => ({ ...prev, [currentCard.id]: 'known' }));
    showToast(`'${currentCard.term}' 알아요 완료! 👏`);
    if (currentIndex < filteredDeck.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }, 200);
    }
  }, [currentCard, currentIndex, filteredDeck.length]);

  const handleMarkUnknown = useCallback(() => {
    if (!currentCard) return;
    setUserProgress((prev) => ({ ...prev, [currentCard.id]: 'unknown' }));
    showToast(`'${currentCard.term}' 복습 목록에 추가되었습니다.`);
    if (currentIndex < filteredDeck.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }, 200);
    }
  }, [currentCard, currentIndex, filteredDeck.length]);

  const handleToggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleSetStatus = useCallback((id: string, status: 'known' | 'unknown') => {
    setUserProgress((prev) => ({
      ...prev,
      [id]: prev[id] === status ? (undefined as unknown as 'known') : status,
    }));
  }, []);

  const handleShuffle = () => {
    const shuffled = [...deckOrder].sort(() => Math.random() - 0.5);
    setDeckOrder(shuffled);
    setDirection(0);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('카드 순서를 무작위로 섞었습니다 🎲');
  };

  const handleResetProgress = () => {
    if (window.confirm('학습 기록을 모두 초기화하시겠습니까? (알아요/모르겠어요 상태가 리셋됩니다)')) {
      setUserProgress({});
      setDirection(0);
      setCurrentIndex(0);
      setIsFlipped(false);
      showToast('학습 상태가 깨끗하게 초기화되었습니다.');
    }
  };

  // Pronunciation with SpeechSynthesis
  const handleSpeak = (text: string, lang: 'FR' | 'EN') => {
    if (!('speechSynthesis' in window)) {
      showToast('브라우저에서 음성 합성을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'FR' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (viewMode !== 'card') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleMarkKnown();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleMarkUnknown();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleToggleFlip, handleMarkKnown, handleMarkUnknown, handlePrev, handleNext]);

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#33241C] flex flex-col font-sans selection:bg-[#EBDCCB] selection:text-[#5B3922]">
      {/* Top Bar (§2 Contract compliant) */}
      <TopBar
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        onResetProgress={handleResetProgress}
        knownCount={stats.known}
        totalCount={stats.total}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col">
        {/* Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#33241C] text-[#FFFDF9] px-4 py-2 rounded-2xl shadow-xl text-xs md:text-sm font-medium flex items-center gap-2 border border-[#8C6342]/40"
            >
              <Sparkles className="w-4 h-4 text-[#F6DEBA]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section with stats, categories, and background visual */}
        <HeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setDirection(0);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          filterMode={filterMode}
          onSelectFilterMode={(mode) => {
            setFilterMode(mode);
            setDirection(0);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          totalCards={stats.total}
          knownCards={stats.known}
          unknownCards={stats.unknown}
          unlearnedCards={stats.unlearned}
          bookmarkedCount={stats.bookmarked}
          onShuffle={handleShuffle}
        />

        {/* VIEW 1: FLASHCARD STUDY MODE */}
        {viewMode === 'card' && (
          <div className="flex-1 flex flex-col justify-center">
            {filteredDeck.length === 0 ? (
              <div className="w-full max-w-md mx-auto my-12 p-8 text-center bg-[#FFFDF9] rounded-3xl border border-[#EBDCCB] shadow-sm">
                <div className="w-16 h-16 bg-[#F2F8F4] text-[#28643E] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#D0E7D8]">
                  {filterMode === 'unknown_only' ? (
                    <CheckCircle2 className="w-8 h-8 text-[#388A58]" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-[#8C6342]" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#33241C] mb-2 font-serif-display">
                  {filterMode === 'unknown_only'
                    ? '모르는 단어가 없습니다! 🎉'
                    : '조건에 해당하는 카드가 없습니다'}
                </h3>
                <p className="text-sm text-[#705948] mb-6">
                  {filterMode === 'unknown_only'
                    ? '현재 선택한 카테고리의 모든 단어를 정복하셨습니다. 전체 카드로 돌아가 다시 복습해보세요.'
                    : '다른 카테고리나 필터를 선택해보세요.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setFilterMode('all');
                      setSelectedCategory('all');
                      setDirection(0);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-[#FFFDF9] bg-[#33241C] hover:bg-[#251A13] rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    전체 카드로 학습하기
                  </button>
                  <button
                    onClick={handleResetProgress}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#7D5A42] bg-[#FAF5EE] hover:bg-[#F2E8DC] rounded-xl transition-all border border-[#DECDBC] cursor-pointer"
                  >
                    진행도 초기화
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Active Card with Smooth Motion Transitions */}
                <div className="relative min-h-[440px] md:min-h-[470px] flex items-center justify-center overflow-hidden py-1">
                  <AnimatePresence mode="wait" custom={direction}>
                    {currentCard && (
                      <motion.div
                        key={currentCard.id}
                        custom={direction}
                        variants={{
                          enter: (dir: number) => ({
                            x: dir === 0 ? 0 : dir > 0 ? 55 : -55,
                            opacity: 0,
                            scale: 0.97,
                            rotate: dir === 0 ? 0 : dir > 0 ? 1 : -1,
                          }),
                          center: {
                            x: 0,
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            transition: {
                              x: { type: 'spring', stiffness: 280, damping: 26 },
                              opacity: { duration: 0.22 },
                              scale: { duration: 0.22 },
                              rotate: { duration: 0.22 },
                            },
                          },
                          exit: (dir: number) => ({
                            x: dir === 0 ? 0 : dir > 0 ? -55 : 55,
                            opacity: 0,
                            scale: 0.97,
                            rotate: dir === 0 ? 0 : dir > 0 ? -1 : 1,
                            transition: {
                              duration: 0.18,
                              ease: [0.32, 0, 0.67, 0],
                            },
                          }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full"
                      >
                        <FlashCard
                          term={currentCard}
                          isFlipped={isFlipped}
                          onFlip={handleToggleFlip}
                          status={userProgress[currentCard.id]}
                          isBookmarked={bookmarks.includes(currentCard.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSpeak={handleSpeak}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Action Controls ('알아요', '모르겠어요', 이전/다음) */}
                <CardControls
                  currentIndex={currentIndex}
                  totalCards={filteredDeck.length}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onFlip={handleToggleFlip}
                  onMarkKnown={handleMarkKnown}
                  onMarkUnknown={handleMarkUnknown}
                  isFlipped={isFlipped}
                />

                {/* Completion Banner if reached the last card */}
                {currentIndex === filteredDeck.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-[#F2F8F4] border border-[#D0E7D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#28643E] shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#388A58] shrink-0" />
                      <span>현재 덱의 마지막 카드입니다! 모르는 단어만 다시 복습해보세요.</span>
                    </div>
                    {stats.unknown > 0 && (
                      <button
                        onClick={() => {
                          setFilterMode('unknown_only');
                          setDirection(0);
                          setCurrentIndex(0);
                          setIsFlipped(false);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-[#388A58] text-[#FFFDF9] rounded-xl hover:bg-[#28643E] shrink-0 transition-colors cursor-pointer shadow-2xs"
                      >
                        모르는 단어 ({stats.unknown}개) 모아보기
                      </button>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}

        {/* VIEW 2: GLOSSARY LIST MODE */}
        {viewMode === 'grid' && (
          <GlossaryList
            terms={filteredDeck}
            userProgress={userProgress}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSetStatus={handleSetStatus}
            onSpeak={handleSpeak}
          />
        )}
      </main>

      {/* Clean quiet footer with warm cafe divider */}
      <footer className="mt-auto border-t border-[#EBDCCB] py-6 px-4 text-center text-xs text-[#8C7667] bg-[#FAF5EE]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 베이크텀즈 (BakeTerms) · 제과제빵과 전공 용어 학습 연구 프로젝트</p>
          <div className="flex items-center gap-4 text-[#A89485]">
            <span>제과 기초 8선</span>
            <span aria-hidden="true">·</span>
            <span>제빵 기초 8선</span>
            <span aria-hidden="true">·</span>
            <span>재료학 8선</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
