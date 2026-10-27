import React from 'react';
import {
  Clock,
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  Eye,
  Check,
  ChevronRight,
  ShieldAlert,
  Flame,
  Activity,
  PackageCheck,
  Timer,
  CheckCheck,
} from 'lucide-react';
import { Incident, IncidentStatus, Priority } from '../types/incident';
import { formatElapsedTime, getStatusLabel } from '../utils/incidentLogic';

interface IncidentPipelineTableProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onOpenAiAnalysis: (inc: Incident) => void;
  onOpenAssignModal: (inc: Incident) => void;
  onQuickComplete: (inc: Incident) => void;
  onManagerDecision: (inc: Incident) => void;
}

export const IncidentPipelineTable: React.FC<IncidentPipelineTableProps> = ({
  incidents,
  onSelectIncident,
  onOpenAiAnalysis,
  onOpenAssignModal,
  onQuickComplete,
  onManagerDecision,
}) => {
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            <Flame className="w-3 h-3 text-red-600" />
            極高優先
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            高優先級
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            中度關注
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            常規記錄
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            待處理
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#476EF6] border border-[#C7D2FE]">
            <span className="w-2 h-2 rounded-full bg-[#476EF6] animate-pulse" />
            處理中
          </span>
        );
      case 'awaiting_manager':
        return (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            等待廠長確認
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-emerald-800 border border-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            已完成
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300">
            <Timer className="w-3.5 h-3.5 text-red-600" />
            逾時未解決
          </span>
        );
      default:
        return null;
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="bg-white rounded-[26px] p-12 text-center border border-[#E2E8F0] shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F5F7FA] flex items-center justify-center text-slate-400 mb-4">
          <CheckCheck className="w-8 h-8 text-[#476EF6]" />
        </div>
        <h3 className="text-[17px] font-bold text-[#15171C]">目前無符合條件之事件</h3>
        <p className="text-[14px] text-slate-500 mt-1 max-w-md mx-auto">
          工廠各產線運作正常，或請調整上方篩選與搜尋條件以查看其他事件。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pipeline Four-Column Guide Header Banner */}
      <div className="hidden md:grid grid-cols-12 gap-4 bg-white rounded-2xl p-3.5 border border-[#E2E8F0] shadow-xs items-center">
        {/* Column 01 */}
        <div className="col-span-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#15171C] text-[#C9F65B] text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
            01
          </span>
          <span className="text-[13px] font-bold text-[#15171C] whitespace-nowrap">接收到事件</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto mr-2 shrink-0" />
        </div>

        {/* Column 02 */}
        <div className="col-span-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#15171C] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
            02
          </span>
          <span className="text-[13px] font-bold text-[#15171C] whitespace-nowrap">幾點幾分事件</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto mr-2 shrink-0" />
        </div>

        {/* Column 03 */}
        <div className="col-span-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#15171C] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
            03
          </span>
          <span className="text-[13px] font-bold text-[#15171C] whitespace-nowrap">誰處理／怎麼處理</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto mr-2 shrink-0" />
        </div>

        {/* Column 04 */}
        <div className="col-span-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#476EF6] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
            04
          </span>
          <span className="text-[13px] font-bold text-[#15171C] whitespace-nowrap">現在狀態與決策</span>
        </div>
      </div>

      {/* Incident Rows List - Each row aligns 4 columns horizontally */}
      <div className="space-y-3.5">
        {incidents.map((inc) => {
          const isCritical = inc.priority === 'critical';
          const isOverdue = inc.status === 'overdue' || inc.elapsedMinutes >= 60;
          const isCompleted = inc.status === 'completed';

          return (
            <div
              key={inc.id}
              className={`bg-white rounded-[24px] p-5 border transition-all relative overflow-hidden group shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md ${
                inc.requiresManagerDecision
                  ? 'border-amber-300 ring-2 ring-amber-200/50'
                  : isCritical && !isCompleted
                  ? 'border-red-200'
                  : 'border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              {/* Subtle top indicator bar */}
              {inc.requiresManagerDecision && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
              )}
              {isCritical && !isCompleted && !inc.requiresManagerDecision && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* ========================================================
                    欄位 01：接收到事件 (Column 01)
                    ======================================================== */}
                <div className="col-span-12 md:col-span-4 pr-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#15171C] text-white">
                      {inc.code}
                    </span>
                    {getPriorityBadge(inc.priority)}
                    <span className="text-[11px] text-slate-400 ml-auto">
                      {inc.source}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectIncident(inc)}
                    className="text-[16px] font-bold text-[#15171C] hover:text-[#476EF6] cursor-pointer transition-colors leading-snug"
                  >
                    {inc.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#476EF6] mt-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{inc.line}</span>
                  </div>

                  <p className="text-[13px] text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {inc.description}
                  </p>
                </div>

                {/* ========================================================
                    欄位 02：幾點幾分事件 (Column 02)
                    ======================================================== */}
                <div className="col-span-12 md:col-span-2 pr-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400 mb-0.5">
                      發生時間
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[26px] font-extrabold text-[#15171C] font-mono tracking-tight">
                        {inc.time}
                      </span>
                      <span className="text-[12px] text-slate-400 font-mono">
                        {inc.date.slice(5)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`text-[12px] font-semibold ${
                          isOverdue && !isCompleted
                            ? 'text-red-600 font-bold'
                            : 'text-slate-600'
                        }`}
                      >
                        已歷時 {formatElapsedTime(inc.elapsedMinutes)}
                      </span>
                    </div>

                    {isOverdue && !isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 mt-2 w-fit">
                        超過標準處置時限
                      </span>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      最近更新: <span className="font-mono text-slate-600">{inc.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    欄位 03：誰處理／怎麼處理 (Column 03)
                    ======================================================== */}
                <div className="col-span-12 md:col-span-3 pr-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                  {inc.assignee ? (
                    <div>
                      {/* Assignee identity */}
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#15171C] text-white flex items-center justify-center text-[12px] font-bold">
                          {inc.assignee.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-bold text-[#15171C]">
                              {inc.assignee.name}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {inc.assignee.dept}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {inc.assignee.role}
                          </span>
                        </div>
                      </div>

                      {/* Handling method */}
                      <div className="bg-[#F8FAFC] rounded-xl p-2.5 text-[12px] text-slate-700 leading-relaxed border border-slate-100">
                        <span className="font-semibold text-slate-900 block mb-0.5">
                          處理處置：
                        </span>
                        {inc.handlingMethod}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500 font-medium">處置進度</span>
                          <span className="font-mono font-bold text-[#476EF6]">
                            {inc.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : 'bg-[#476EF6]'
                            }`}
                            style={{ width: `${inc.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 italic">
                        最後回報：{inc.lastReportNote}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl text-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-1.5">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-bold text-red-800 block">尚未指派負責人</span>
                      <p className="text-[11px] text-red-600 mt-0.5 mb-2.5">
                        需要廠長或值班主管立即指派專人接洽處置
                      </p>
                      <button
                        onClick={() => onOpenAssignModal(inc)}
                        className="w-full py-1.5 px-3 rounded-xl bg-[#15171C] hover:bg-slate-800 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#C9F65B]" />
                        <span>立即指派人員</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* ========================================================
                    欄位 04：現在狀態 (Column 04)
                    ======================================================== */}
                <div className="col-span-12 md:col-span-3 flex flex-col justify-between h-full">
                  <div>
                    {/* Status badge & manager decision alert */}
                    <div className="flex items-center justify-between mb-2">
                      {getStatusBadge(inc.status)}

                      {inc.requiresManagerDecision && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#15171C] text-[#C9F65B] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9F65B] animate-ping" />
                          需廠長決策
                        </span>
                      )}
                    </div>

                    {/* Current result & next step */}
                    <div className="text-[12px] space-y-1.5 text-slate-700 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-900">目前結果：</span>
                        <span>{inc.currentResult}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">下一步：</span>
                        <span className="text-slate-600">{inc.nextStep}</span>
                      </div>
                    </div>

                    {/* Decision prompt banner if requiresManagerDecision */}
                    {inc.requiresManagerDecision && (
                      <div className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                          ⚠️ {inc.managerDecisionPrompt}
                        </p>
                        <button
                          onClick={() => onManagerDecision(inc)}
                          className="mt-1.5 w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                        >
                          立即執行廠長決策批覆
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions toolbar */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onSelectIncident(inc)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] font-semibold text-slate-700 hover:text-[#15171C] flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>查看詳情</span>
                    </button>

                    <button
                      onClick={() => onOpenAiAnalysis(inc)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[12px] font-semibold flex items-center justify-center gap-1 transition-all shadow-xs group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C9F65B] group-hover:rotate-12 transition-transform" />
                      <span>交給 AI 分析</span>
                    </button>

                    {/* Quick Complete / Close Incident button */}
                    {!isCompleted && (
                      <button
                        onClick={() => onQuickComplete(inc)}
                        title="確認處置合格並結案"
                        className="py-2 px-2.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-emerald-300 text-emerald-800 text-[12px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>結案</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
