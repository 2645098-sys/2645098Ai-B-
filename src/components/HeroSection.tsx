import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, Bookmark, Shuffle } from 'lucide-react';
import { CATEGORIES, CategoryId } from '../data/terms';
import heroImage from '../assets/images/bakery_study_hero_1794403862287.jpg';

interface HeroSectionProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  filterMode: 'all' | 'unknown_only' | 'bookmarked';
  onSelectFilterMode: (mode: 'all' | 'unknown_only' | 'bookmarked') => void;
  totalCards: number;
  knownCards: number;
  unknownCards: number;
  unlearnedCards: number;
  bookmarkedCount: number;
  onShuffle: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  filterMode,
  onSelectFilterMode,
  totalCards,
  knownCards,
  unknownCards,
  unlearnedCards,
  bookmarkedCount,
  onShuffle,
}) => {
  const progressPercent = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

  return (
    <div className="w-full mb-8">
      {/* Visual Bakery Hero Banner with Scrim & Artisan Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E8DAC8] shadow-md shadow-[#4A3223]/10 bg-[#FAF5EE]">
        <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden">
          <img
            src={heroImage}
            alt="제과제빵 작업대와 갓 구운 빵, 레시피 노트"
            className="w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.02]"
            referrerPolicy="no-referrer"
          />
          {/* Measured warm bakery scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#241710]/95 via-[#241710]/60 to-transparent flex flex-col justify-end p-5 md:p-8" />

          {/* Hero text overlay with French Patisserie nuance */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#F7EFE4] mb-2 tracking-wide">
              <span className="bg-[#FAF5EE]/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20 text-[#FFF9F2]">
                Pâtisserie & Boulangerie Atelier
              </span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>제과제빵 전공 필수 단어장</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 text-balance font-serif-display drop-shadow-sm">
              파티시에 & 블랑제 필수 전문 용어 플래시카드
            </h1>
            <p className="text-xs md:text-sm text-[#F0E4D5] max-w-xl font-normal leading-relaxed">
              프랑스어 제과 기법부터 발효 과학, 재료학 필수 개념까지 따뜻한 베이커리 아틀리에에서 하나씩 완성해보세요.
            </p>
          </div>
        </div>

        {/* Stats Strip & Progress Bar with Harmonized Cafe Colors */}
        <div className="bg-[#FFFDF9] p-4 md:p-6 border-t border-[#EBDCCB]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C7667] mb-1">
                <span>학습 진행률</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#402F24]">전체 {totalCards}개 전공 용어</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-extrabold tabular-nums text-[#9A6237] font-serif-display">
                  {progressPercent}%
                </span>
                <span className="text-xs text-[#8C7667]">
                  ({knownCards}개 완료 · {unknownCards}개 복습 필요)
                </span>
              </div>
            </div>

            {/* Harmonized Bakery Stat Cards */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              {/* 전체 카드 */}
              <div className="bg-[#FAF6F0] p-2.5 rounded-2xl border border-[#E8DCCB] shadow-2xs">
                <span className="block text-[11px] font-medium text-[#7D6452]">전체 카드</span>
                <span className="text-base md:text-lg font-bold tabular-nums text-[#33241C]">
                  {totalCards}
                </span>
              </div>

              {/* 알아요 (Pistachio Matcha) */}
              <div className="bg-[#F2F8F4] p-2.5 rounded-2xl border border-[#D0E7D8] shadow-2xs">
                <span className="block text-[11px] font-medium text-[#2E6A44] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#388A58]" />
                  알아요
                </span>
                <span className="text-base md:text-lg font-bold tabular-nums text-[#28643E]">
                  {knownCards}
                </span>
              </div>

              {/* 모르겠어요 (Warm Raspberry) */}
              <div className="bg-[#FDF4F4] p-2.5 rounded-2xl border border-[#F4D2D2] shadow-2xs">
                <span className="block text-[11px] font-medium text-[#963838] flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#B84D4D]" />
                  모르겠어요
                </span>
                <span className="text-base md:text-lg font-bold tabular-nums text-[#8A3030]">
                  {unknownCards}
                </span>
              </div>

              {/* 학습 전 (Soft Oat) */}
              <div className="bg-[#F8F3EC] p-2.5 rounded-2xl border border-[#E8DAC9] shadow-2xs">
                <span className="block text-[11px] font-medium text-[#7A6352] flex items-center justify-center gap-1">
                  <HelpCircle className="w-3 h-3 text-[#967C69]" />
                  학습 전
                </span>
                <span className="text-base md:text-lg font-bold tabular-nums text-[#5C4535]">
                  {unlearnedCards}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Progress Line with Soft Warm Fills */}
          <div className="w-full bg-[#EFE4D6] h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-[#388A58] h-full transition-all duration-500 ease-out"
              style={{ width: `${(knownCards / (totalCards || 1)) * 100}%` }}
              title={`암기 완료: ${knownCards}개`}
            />
            <div
              className="bg-[#B84D4D] h-full transition-all duration-500 ease-out"
              style={{ width: `${(unknownCards / (totalCards || 1)) * 100}%` }}
              title={`복습 필요: ${unknownCards}개`}
            />
          </div>
        </div>

        {/* Filters and Category Navigation with Cafe Menu Tab feel */}
        <div className="bg-[#FAF5EE] px-4 md:px-6 py-3 border-t border-[#EBDCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#33241C] text-[#FFFDF9] shadow-xs'
                      : 'bg-[#FFFDF9] text-[#7A604E] hover:bg-[#F2E8DB] border border-[#E4D4C3]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Mode Toggles: All vs Unknown Only vs Bookmarked */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => onSelectFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#EAE0D3] text-[#33241C] border border-[#D8C7B5] shadow-2xs'
                  : 'text-[#7D6452] hover:bg-[#F2E8DB]'
              }`}
            >
              모든 카드
            </button>

            <button
              onClick={() => onSelectFilterMode('unknown_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filterMode === 'unknown_only'
                  ? 'bg-[#FDF2F2] text-[#963838] border border-[#F4D0D0] shadow-2xs'
                  : 'text-[#7D6452] hover:bg-[#F2E8DB]'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#B84D4D]" />
              <span>모르는 단어만 ({unknownCards})</span>
            </button>

            <button
              onClick={() => onSelectFilterMode('bookmarked')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filterMode === 'bookmarked'
                  ? 'bg-[#FEF5E7] text-[#9E631F] border border-[#F6DEBA] shadow-2xs'
                  : 'text-[#7D6452] hover:bg-[#F2E8DB]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C07D3E]" />
              <span>중요 ({bookmarkedCount})</span>
            </button>

            <button
              onClick={onShuffle}
              className="p-1.5 text-[#7D6452] hover:text-[#33241C] hover:bg-[#F2E8DB] rounded-xl transition-colors ml-1 border border-[#E4D4C3] cursor-pointer shadow-2xs"
              title="카드 순서 섞기"
              aria-label="카드 섞기"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
