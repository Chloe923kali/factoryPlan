import React from 'react';
import { ArrowUpRight, AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { IncidentSummaryStats } from '../types/incident';

interface SummaryCardsProps {
  stats: IncidentSummaryStats;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  stats,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: 今日事件總數 */}
      <div
        onClick={() => onFilterChange('all')}
        className={`bg-white rounded-[26px] p-6 border transition-all cursor-pointer relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg ${
          activeFilter === 'all'
            ? 'border-[#476EF6] ring-2 ring-[#476EF6]/20'
            : 'border-[#E2E8F0] hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-[#15171C] text-white uppercase">
            TODAY INCIDENTS
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F5F7FA] group-hover:bg-[#15171C] group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <div className="text-[34px] font-extrabold text-[#15171C] tracking-tight font-mono tabular-nums">
              {stats.total}
              <span className="text-[15px] font-medium text-slate-400 ml-1.5 font-sans">
                件
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-1">
              今日工廠事件總計
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#476EF6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#476EF6]" />
              {stats.criticalCount} 筆高優先
            </span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
          <span>第一廠區即時同步</span>
          <span className="text-slate-600 font-semibold font-mono">100% 覆蓋</span>
        </div>
      </div>

      {/* Card 2: 處理中 */}
      <div
        onClick={() => onFilterChange('in_progress')}
        className={`bg-white rounded-[26px] p-6 border transition-all cursor-pointer relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg ${
          activeFilter === 'in_progress'
            ? 'border-[#476EF6] ring-2 ring-[#476EF6]/20'
            : 'border-[#E2E8F0] hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-[#476EF6] text-white uppercase">
            IN PROGRESS
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F5F7FA] group-hover:bg-[#476EF6] group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <div className="text-[34px] font-extrabold text-[#15171C] tracking-tight font-mono tabular-nums">
              {stats.inProgress}
              <span className="text-[15px] font-medium text-slate-400 ml-1.5 font-sans">
                件
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-1">
              專責工程師現場排除中
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              <Clock className="w-3 h-3" />
              SLA 進行中
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
          <span>包含 CNC-03 與 A02</span>
          <span className="text-[#476EF6] font-semibold">即時監控</span>
        </div>
      </div>

      {/* Card 3: 待廠長決策 (Awaiting Manager Decision) */}
      <div
        onClick={() => onFilterChange('awaiting_decision')}
        className={`bg-white rounded-[26px] p-6 border transition-all cursor-pointer relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg ${
          activeFilter === 'awaiting_decision'
            ? 'border-[#C9F65B] ring-2 ring-lime-400/40'
            : 'border-[#E2E8F0] hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-[#15171C] text-[#C9F65B] uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9F65B] animate-ping" />
            DECISION REQUIRED
          </span>
          <div className="w-8 h-8 rounded-full bg-[#C9F65B] text-[#15171C] flex items-center justify-center font-bold">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <div className="text-[34px] font-extrabold text-[#15171C] tracking-tight font-mono tabular-nums">
              {stats.awaitingManager}
              <span className="text-[15px] font-medium text-slate-400 ml-1.5 font-sans">
                件
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-1">
              需要廠長立即審核決策
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3 h-3" />
              急迫案件
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
          <span>包裝線重啟 / 原料採購</span>
          <span className="text-amber-600 font-semibold">待核准</span>
        </div>
      </div>

      {/* Card 4: 已完成 (Completed) */}
      <div
        onClick={() => onFilterChange('completed')}
        className={`bg-white rounded-[26px] p-6 border transition-all cursor-pointer relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg ${
          activeFilter === 'completed'
            ? 'border-emerald-500 ring-2 ring-emerald-400/20'
            : 'border-[#E2E8F0] hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-700 text-white uppercase">
            RESOLVED
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F5F7FA] group-hover:bg-emerald-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <div className="text-[34px] font-extrabold text-[#15171C] tracking-tight font-mono tabular-nums">
              {stats.completed}
              <span className="text-[15px] font-medium text-slate-400 ml-1.5 font-sans">
                件
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-1">
              今日已確認結案歸檔
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              100% 驗收
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
          <span>空壓保養合規結案</span>
          <span className="text-emerald-600 font-semibold">已存檔</span>
        </div>
      </div>
    </div>
  );
};
