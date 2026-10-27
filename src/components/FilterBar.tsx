import React from 'react';
import { Search, Filter, SlidersHorizontal, Plus, RotateCcw, Calendar } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  lineFilter: string;
  onLineChange: (line: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  sortBy: 'time' | 'priority' | 'status';
  onSortChange: (sort: 'time' | 'priority' | 'status') => void;
  onOpenNewIncidentModal: () => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  lineFilter,
  onLineChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  onOpenNewIncidentModal,
  onResetFilters,
  totalFiltered,
}) => {
  const lineOptions = [
    { value: 'all', label: '全部產線與設備' },
    { value: 'CNC', label: 'CNC 車銑加工區' },
    { value: 'A02', label: 'A02 精密組裝線' },
    { value: '倉儲', label: '原料倉儲區' },
    { value: '包裝', label: '成品包裝線' },
    { value: '公用', label: '公用廠務設施' },
  ];

  const categoryOptions = [
    { value: 'all', label: '全部類型' },
    { value: 'equipment', label: '設備異常' },
    { value: 'quality', label: '品質製程' },
    { value: 'inventory', label: '物料庫存' },
    { value: 'maintenance', label: '保養維護' },
    { value: 'operation', label: '人員交接' },
  ];

  const statusTabs = [
    { value: 'all', label: '全部' },
    { value: 'awaiting_decision', label: '待廠長決策' },
    { value: 'in_progress', label: '處理中' },
    { value: 'overdue', label: '逾時未解決' },
    { value: 'completed', label: '已完成' },
  ];

  const isFiltered =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    lineFilter !== 'all' ||
    categoryFilter !== 'all' ||
    sortBy !== 'time';

  return (
    <div className="bg-white rounded-[24px] p-5 border border-[#E2E8F0] shadow-xs space-y-4">
      {/* Upper row: Search, Line, Category, Sort, New Incident */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋事件名稱、編號、負責人、設備、關鍵字..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#15171C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30 focus:border-[#476EF6] transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Line filter */}
          <select
            value={lineFilter}
            onChange={(e) => onLineChange(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30 cursor-pointer"
          >
            {lineOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30 cursor-pointer"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[12px] text-slate-400">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="time">發生時間 (近至遠)</option>
              <option value="priority">緊急優先級 (最高優先)</option>
              <option value="status">處置狀態緊迫度</option>
            </select>
          </div>

          {/* Reset Filters button if any active */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-[#15171C] hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重設篩選</span>
            </button>
          )}

          {/* Quick Create Incident Button */}
          <button
            onClick={onOpenNewIncidentModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15171C] hover:bg-[#282C34] text-white text-[13px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4 text-[#C9F65B]" />
            <span>模擬新增事件</span>
          </button>
        </div>
      </div>

      {/* Lower row: Status segmented controls & Total counter */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F7FA] rounded-xl border border-slate-200/80">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#15171C] font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-[13px] text-slate-500 font-medium">
          顯示 <span className="font-bold text-[#15171C] font-mono">{totalFiltered}</span> 筆事件進程
        </div>
      </div>
    </div>
  );
};
