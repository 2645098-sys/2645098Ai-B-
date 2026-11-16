import React, { useState } from 'react';
import { Search, Volume2, Bookmark, ChevronDown, ChevronUp, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { Term } from '../data/terms';

interface GlossaryListProps {
  terms: Term[];
  userProgress: Record<string, 'known' | 'unknown'>;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onSetStatus: (id: string, status: 'known' | 'unknown') => void;
  onSpeak: (text: string, lang: 'FR' | 'EN') => void;
}

export const GlossaryList: React.FC<GlossaryListProps> = ({
  terms,
  userProgress,
  bookmarks,
  onToggleBookmark,
  onSetStatus,
  onSpeak,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTerms = terms.filter((term) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      term.term.toLowerCase().includes(q) ||
      term.originalTerm.toLowerCase().includes(q) ||
      term.shortSummary.toLowerCase().includes(q) ||
      term.categoryLabel.toLowerCase().includes(q) ||
      term.fullDefinition.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Header */}
      <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EBDCCB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A89485] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="단어명, 원어(Blanchir, Gluten 등), 설명 검색..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#FAF5EE] border border-[#DECDBC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C6342]/30 text-[#33241C] placeholder:text-[#A89485]"
          />
        </div>

        <div className="text-xs text-[#8C7667] flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span>검색 결과:</span>
          <span className="font-bold text-[#8C6342] tabular-nums">{filteredTerms.length}</span>
          <span>/ 전체 {terms.length}개</span>
        </div>
      </div>

      {/* Terms Accordion List */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFDF9] rounded-2xl border border-[#EBDCCB] text-[#8C7667]">
          <p className="text-base font-semibold mb-1">검색 조건에 맞는 전공 용어가 없습니다.</p>
          <p className="text-xs text-[#A89485]">검색어를 바꾸거나 필터를 재설정해보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTerms.map((term) => {
            const status = userProgress[term.id];
            const isBookmarked = bookmarks.includes(term.id);
            const isExpanded = expandedId === term.id;

            return (
              <div
                key={term.id}
                className={`bg-[#FFFDF9] rounded-2xl border transition-all shadow-2xs ${
                  status === 'known'
                    ? 'border-[#C9E5D4] bg-[#F7FBF9]'
                    : status === 'unknown'
                    ? 'border-[#F4D2D2] bg-[#FDF8F8]'
                    : 'border-[#EBDCCB] hover:border-[#DCC8B3]'
                }`}
              >
                {/* Accordion Row Header */}
                <div
                  onClick={() => toggleExpand(term.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 shadow-2xs ${getCategoryBadgeClass(
                        term.category
                      )}`}
                    >
                      {term.categoryLabel}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-[#33241C]">
                          {term.term}
                        </h3>
                        <span className="font-serif-display italic text-xs sm:text-sm font-semibold text-[#8C6342]">
                          {term.originalTerm}
                        </span>
                        {term.pronunciation && (
                          <span className="text-xs text-[#9C8675] font-mono hidden md:inline">
                            {term.pronunciation}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#705948] truncate max-w-md mt-0.5">
                        {term.shortSummary}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSpeak(term.originalTerm, term.language)}
                      className="p-1.5 text-[#9C8675] hover:text-[#33241C] hover:bg-[#FAF3E8] rounded-lg transition-colors cursor-pointer"
                      title="발음 듣기"
                      aria-label="발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleBookmark(term.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-[#C07D3E] bg-[#FEF5E7]'
                          : 'text-[#A89485] hover:text-[#786150] hover:bg-[#F2E7D8]'
                      }`}
                      title={isBookmarked ? '중요 단어 해제' : '중요 단어로 표시'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSetStatus(term.id, 'unknown')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        status === 'unknown'
                          ? 'bg-[#B84D4D] text-white border-[#B84D4D] shadow-2xs'
                          : 'bg-[#FDF4F4] text-[#8F3333] border-[#F4CDCD] hover:bg-[#FBEAEA]'
                      }`}
                      title="모르겠어요 표시"
                    >
                      모름
                    </button>

                    <button
                      type="button"
                      onClick={() => onSetStatus(term.id, 'known')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        status === 'known'
                          ? 'bg-[#388A58] text-white border-[#388A58] shadow-2xs'
                          : 'bg-[#F2F8F4] text-[#245F3A] border-[#CFE8D9] hover:bg-[#EAF5EF]'
                      }`}
                      title="알아요 표시"
                    >
                      앎
                    </button>

                    <div className="text-[#A89485] pl-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-[#EBDCCB]/70 space-y-3 bg-[#FAF5EE]/70">
                    <div>
                      <h4 className="text-xs font-bold text-[#8C6342] mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        전공 상세 해설
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4A392D] leading-relaxed bg-[#FFFDF9] p-3 rounded-xl border border-[#E8DCCB]">
                        {term.fullDefinition}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#A76326] mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        실무 핵심 포인트
                      </h4>
                      <ul className="space-y-1 text-xs text-[#594435]">
                        {term.keyPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#C07D3E] font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#F5F8FA] border border-[#D5E5F2] p-2.5 rounded-xl flex items-start gap-2 text-xs text-[#1B4D6B]">
                      <Lightbulb className="w-4 h-4 text-[#2C698D] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">시험 TIP: </span>
                        <span>{term.examTip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
