import React from 'react';
import { Layers, List, RotateCcw } from 'lucide-react';

interface TopBarProps {
  viewMode: 'card' | 'grid';
  onSelectViewMode: (mode: 'card' | 'grid') => void;
  onResetProgress: () => void;
  knownCount: number;
  totalCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onSelectViewMode,
  onResetProgress,
  knownCount,
  totalCount,
}) => {
  const percent = Math.round((knownCount / (totalCount || 1)) * 100);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF5EE]/95 backdrop-blur-md border-b border-[#EADCCB] px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line text element) */}
        <a
          href="#"
          className="text-lg md:text-xl font-extrabold tracking-tight text-[#33241C] flex items-center gap-2.5 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F5ECE0] to-[#EADCCB] border border-[#DECDBC] flex items-center justify-center text-base shadow-2xs">
            🥖
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-tight">베이크텀즈</span>
            <span className="font-serif-display italic text-xs font-semibold text-[#8C6342]">
              BakeTerms
            </span>
          </div>
        </a>

        {/* Zone 2: 4 nav links with clean single-line styling */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#705948]">
          <button
            onClick={() => onSelectViewMode('card')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
              viewMode === 'card'
                ? 'border-[#8C5E38] text-[#33241C] font-bold'
                : 'border-transparent hover:text-[#33241C]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#8C5E38]" />
            <span>플래시카드 학습</span>
          </button>

          <button
            onClick={() => onSelectViewMode('grid')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
              viewMode === 'grid'
                ? 'border-[#8C5E38] text-[#33241C] font-bold'
                : 'border-transparent hover:text-[#33241C]'
            }`}
          >
            <List className="w-4 h-4 text-[#8C5E38]" />
            <span>전체 단어장</span>
          </button>

          <div className="text-xs text-[#8C7667] flex items-center gap-2 whitespace-nowrap shrink-0 pl-3 border-l border-[#EADCCB]">
            <span className="text-[#967C6A]">암기 진행도</span>
            <span className="font-bold tabular-nums text-[#388A58]">
              {percent}%
            </span>
            <span aria-hidden="true" className="text-[#DECDBC]">·</span>
            <span className="text-[#594233] font-semibold">{knownCount}/{totalCount}개</span>
          </div>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex md:hidden items-center bg-[#EFE4D6] p-1 rounded-xl border border-[#E2D2BF]">
            <button
              onClick={() => onSelectViewMode('card')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-[#33241C] shadow-2xs font-bold'
                  : 'text-[#7D6452]'
              }`}
            >
              카드
            </button>
            <button
              onClick={() => onSelectViewMode('grid')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#33241C] shadow-2xs font-bold'
                  : 'text-[#7D6452]'
              }`}
            >
              목록
            </button>
          </div>

          <button
            type="button"
            onClick={onResetProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7D5A42] bg-[#FAF5EE] hover:bg-[#F2E8DC] active:bg-[#EBDDCF] rounded-xl transition-all whitespace-nowrap shrink-0 border border-[#DECDBC] cursor-pointer shadow-2xs"
            title="학습 기록 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#967055]" />
            <span className="hidden sm:inline">학습 초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};
