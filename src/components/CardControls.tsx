import React from 'react';
import { ChevronLeft, ChevronRight, Check, X, RotateCw } from 'lucide-react';

interface CardControlsProps {
  currentIndex: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
  onFlip: () => void;
  onMarkKnown: () => void;
  onMarkUnknown: () => void;
  isFlipped: boolean;
}

export const CardControls: React.FC<CardControlsProps> = ({
  currentIndex,
  totalCards,
  onPrev,
  onNext,
  onFlip,
  onMarkKnown,
  onMarkUnknown,
  isFlipped,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 flex flex-col items-center gap-4">
      {/* Primary Action Buttons: Bakery Harmonized '모르겠어요' & '알아요' */}
      <div className="w-full grid grid-cols-2 gap-3.5 sm:gap-4">
        {/* 모르겠어요 Button (Soft Raspberry Cream) */}
        <button
          type="button"
          onClick={onMarkUnknown}
          className="group relative flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base text-[#8F3333] bg-gradient-to-b from-[#FFF5F5] to-[#FAECEC] hover:from-[#FAECEC] hover:to-[#F5E2E2] active:scale-[0.98] border-2 border-[#F3CDCD] shadow-md shadow-[#B84D4D]/10 transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#B84D4D] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <X className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>모르겠어요</span>
          <span className="hidden sm:inline text-xs font-semibold text-[#8F3333]/90 bg-white/80 px-2 py-0.5 rounded-md border border-[#F1C2C2] ml-1">
            복습 추가
          </span>
        </button>

        {/* 알아요 Button (Pistachio Matcha Cream) */}
        <button
          type="button"
          onClick={onMarkKnown}
          className="group relative flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base text-[#245F3A] bg-gradient-to-b from-[#F3FAF5] to-[#E9F5ED] hover:from-[#E9F5ED] hover:to-[#DEF0E4] active:scale-[0.98] border-2 border-[#C9E5D4] shadow-md shadow-[#388A58]/10 transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#388A58] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>알아요!</span>
          <span className="hidden sm:inline text-xs font-semibold text-[#245F3A]/90 bg-white/80 px-2 py-0.5 rounded-md border border-[#B9E0C8] ml-1">
            암기 완료
          </span>
        </button>
      </div>

      {/* Navigation & Flip Toolbar (Warm Bakery Deck) */}
      <div className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#FFFDF9] rounded-2xl border border-[#EBDCCB] shadow-2xs">
        {/* Previous Card */}
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-[#664E3D] hover:text-[#33241C] hover:bg-[#F5ECE0] disabled:opacity-35 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
          aria-label="이전 카드"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전</span>
        </button>

        {/* Center: Flip & Index indicator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onFlip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#8C5E38] bg-[#FAF3E8] hover:bg-[#F2E5D4] active:scale-95 rounded-xl transition-all border border-[#E8DAC8] shadow-2xs cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8C5E38]" />
            <span>{isFlipped ? '앞면 보기' : '뒤집어서 뜻 보기'}</span>
          </button>

          <span className="text-xs sm:text-sm font-bold text-[#8C6342] tabular-nums font-mono">
            {totalCards > 0 ? currentIndex + 1 : 0} / {totalCards}
          </span>
        </div>

        {/* Next Card */}
        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= totalCards - 1}
          className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-[#664E3D] hover:text-[#33241C] hover:bg-[#F5ECE0] disabled:opacity-35 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
          aria-label="다음 카드"
        >
          <span>다음</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="hidden md:flex items-center gap-4 text-xs text-[#9C8675] font-mono">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 bg-[#FFFDF9] border border-[#DECDBC] rounded-md shadow-2xs text-[#705948]">
            Space
          </kbd>{' '}
          카드 뒤집기
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 bg-[#FFFDF9] border border-[#DECDBC] rounded-md shadow-2xs text-[#705948]">
            ←
          </kbd>{' '}
          모르겠어요
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 bg-[#FFFDF9] border border-[#DECDBC] rounded-md shadow-2xs text-[#705948]">
            →
          </kbd>{' '}
          알아요
        </span>
      </div>
    </div>
  );
};
