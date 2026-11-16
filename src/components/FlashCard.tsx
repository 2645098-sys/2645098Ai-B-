import React from 'react';
import { Volume2, RotateCw, Bookmark, Sparkles, BookOpen, Lightbulb, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Term } from '../data/terms';

interface FlashCardProps {
  term: Term;
  isFlipped: boolean;
  onFlip: () => void;
  status?: 'known' | 'unknown';
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSpeak: (text: string, lang: 'FR' | 'EN') => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  term,
  isFlipped,
  onFlip,
  status,
  isBookmarked,
  onToggleBookmark,
  onSpeak,
}) => {
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'pastry':
        return 'text-[#9A5B20] bg-[#FDF3E5] border-[#F6DEBA]';
      case 'bread':
        return 'text-[#864C1E] bg-[#F8EFE4] border-[#EFD5BC]';
      case 'science':
        return 'text-[#2C698D] bg-[#EEF5FA] border-[#D0E4F2]';
      default:
        return 'text-[#634E3F] bg-[#F4EDE2] border-[#E5DACB]';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1200 select-none py-2">
      {/* 3D Motion Card Container */}
      <motion.div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
        whileHover={{ y: -3, scale: 1.006 }}
        whileTap={{ scale: 0.99 }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.23, 1, 0.32, 1], // Natural buttery smooth cubic bezier
        }}
        aria-label={`플래시카드: ${term.term}. 클릭하여 앞뒷면 뒤집기`}
        className="relative w-full min-h-[440px] md:min-h-[470px] cursor-pointer transform-style-3d outline-none focus-visible:ring-4 focus-visible:ring-[#8C6342]/40 rounded-3xl"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ================= CARD FRONT (Bakery Recipe Card) ================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-6 md:p-10 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] border-2 shadow-xl shadow-[#5C402D]/8 transition-colors duration-300 ${
            status === 'known'
              ? 'border-[#A3D9B5] ring-2 ring-[#D4EDDD]/60'
              : status === 'unknown'
              ? 'border-[#F1B9B9] ring-2 ring-[#FAE0E0]/60'
              : 'border-[#E8DCCB] hover:border-[#DCC8B3]'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          {/* Subtle Ambient Sheen */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none opacity-60" />

          {/* Top Row: Category & Status */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-2xs ${getCategoryTheme(
                  term.category
                )}`}
              >
                {term.categoryLabel}
              </span>
              <span className="text-xs text-[#8C7667] font-mono">
                {term.language === 'FR' ? '프랑스어' : '영어'} 원어
              </span>
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onToggleBookmark(term.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'text-[#C07D3E] bg-[#FEF5E7] border border-[#F6DEBA]'
                    : 'text-[#A89485] hover:text-[#786150] hover:bg-[#F2E7D8]'
                }`}
                title={isBookmarked ? '중요 단어 해제' : '중요 단어로 저장'}
                aria-label="북마크 토글"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {status === 'known' && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#28643E] bg-[#F2F8F4] px-2.5 py-1 rounded-full border border-[#D0E7D8]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  알아요
                </span>
              )}
              {status === 'unknown' && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#8A3030] bg-[#FDF4F4] px-2.5 py-1 rounded-full border border-[#F4D2D2]">
                  <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  복습 필요
                </span>
              )}
            </div>
          </div>

          {/* Center: Main Term and French/English original */}
          <div className="relative z-10 my-auto text-center px-2 py-4">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="font-serif-display italic text-base md:text-lg font-semibold text-[#8C6342] tracking-wide">
                {term.originalTerm}
              </span>
              {term.pronunciation && (
                <span className="text-xs md:text-sm text-[#9C8675] font-mono">
                  {term.pronunciation}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(term.originalTerm, term.language);
                }}
                className="p-1.5 text-[#9C8675] hover:text-[#33241C] hover:bg-[#EFE3D5] rounded-xl transition-colors cursor-pointer"
                title="원어 발음 듣기"
                aria-label="발음 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#33241C] tracking-tight mb-4 drop-shadow-2xs">
              {term.term}
            </h2>

            <p className="text-sm md:text-base text-[#5C4535] max-w-lg mx-auto font-medium leading-relaxed bg-[#F7EFE4]/80 py-3.5 px-5 rounded-2xl border border-[#E8DAC8] shadow-2xs">
              💡 {term.shortSummary}
            </p>
          </div>

          {/* Bottom Flip Prompt */}
          <div className="relative z-10 flex items-center justify-center gap-2 pt-3 border-t border-[#E8DAC8]/70 text-xs md:text-sm text-[#8C7667] font-medium">
            <RotateCw className="w-4 h-4 text-[#8C6342] animate-spin" style={{ animationDuration: '4s' }} />
            <span>카드를 클릭하면 부드럽게 회전하여 상세 뜻과 시험 팁을 확인합니다</span>
          </div>
        </div>

        {/* ================= CARD BACK (Bakery Notebook Definition) ================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-6 md:p-9 flex flex-col justify-between bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF9] to-[#FBF7F0] border-2 shadow-xl shadow-[#5C402D]/8 transition-colors duration-300 overflow-y-auto ${
            status === 'known'
              ? 'border-[#A3D9B5] ring-2 ring-[#D4EDDD]/60'
              : status === 'unknown'
              ? 'border-[#F1B9B9] ring-2 ring-[#FAE0E0]/60'
              : 'border-[#E8DCCB]'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Subtle Ambient Sheen */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-[#FAF5EE]/30 to-transparent pointer-events-none opacity-40" />

          {/* Back Top: Term Header & Flip Back Button */}
          <div className="relative z-10 flex items-start justify-between gap-3 border-b border-[#EBDCCB] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryTheme(term.category)}`}>
                  {term.categoryLabel} 해설
                </span>
                <span className="font-serif-display italic text-xs text-[#8C6342]">{term.originalTerm}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#33241C] mt-1">
                {term.term}
              </h3>
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onToggleBookmark(term.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'text-[#C07D3E] bg-[#FEF5E7] border border-[#F6DEBA]'
                    : 'text-[#A89485] hover:text-[#786150] hover:bg-[#F2E7D8]'
                }`}
                title="중요 단어 토글"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onFlip}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#8C6342] bg-[#FAF3E8] hover:bg-[#F2E5D5] active:bg-[#EBDDCF] rounded-xl transition-colors border border-[#E8DAC8] cursor-pointer shadow-2xs"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#8C6342]" />
                앞면 보기
              </button>
            </div>
          </div>

          {/* Back Body: Full Definition & Key Points */}
          <div className="relative z-10 my-3 space-y-4 text-left">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6342] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                전공 학술 정의
              </h4>
              <p className="text-sm md:text-base text-[#402F24] leading-relaxed font-normal bg-[#FAF5EE] p-3.5 rounded-xl border border-[#E8DCCB]">
                {term.fullDefinition}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A76326] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                실무 핵심 포인트
              </h4>
              <ul className="space-y-1.5 text-xs md:text-sm text-[#544033]">
                {term.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#FDF9F2] p-2.5 rounded-xl border border-[#F6EADB]">
                    <span className="text-[#C07D3E] font-bold shrink-0 mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam & Field Tip */}
            <div className="bg-[#F5F8FA] border border-[#D5E5F2] p-3 rounded-xl flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#2C698D] shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm text-[#1B4D6B]">
                <strong className="font-semibold block mb-0.5">시험 & 현장 TIP</strong>
                <span>{term.examTip}</span>
              </div>
            </div>
          </div>

          {/* Back Footer */}
          <div className="relative z-10 pt-2 border-t border-[#EBDCCB] flex items-center justify-between text-xs text-[#8C7667]">
            <span>다시 클릭하면 카드 앞면으로 회전합니다</span>
            <span className="font-mono text-[#A89485]">{term.language}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
