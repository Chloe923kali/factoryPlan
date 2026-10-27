import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Activity,
  Layers,
  ShieldAlert,
  ArrowRight,
  Check,
  AlertCircle,
  FileText,
  UserPlus,
} from 'lucide-react';
import { Incident } from '../types/incident';
import { formatElapsedTime, getStatusLabel } from '../utils/incidentLogic';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onOpenAiAnalysis: (inc: Incident) => void;
  onOpenRecordModal: (inc: Incident) => void;
  onOpenAssignModal: (inc: Incident) => void;
  onUpdateStatus: (id: string, newStatus: any, note?: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onOpenAiAnalysis,
  onOpenRecordModal,
  onOpenAssignModal,
  onUpdateStatus,
}) => {
  if (!incident) return null;

  const isCompleted = incident.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#15171C]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-white to-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#15171C] text-white">
                {incident.code}
              </span>
              <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#476EF6]">
                {incident.line}
              </span>
              <span className="text-[12px] font-semibold text-slate-500">
                來源：{incident.source}
              </span>
            </div>
            <h2 className="text-[22px] font-bold text-[#15171C] tracking-tight">
              {incident.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Manager Decision Banner if required */}
          {incident.requiresManagerDecision && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-[14px]">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>廠長專屬核定事項 (Plant Manager Sign-Off)</span>
              </div>
              <p className="text-[13px] text-amber-800 leading-relaxed">
                {incident.managerDecisionPrompt}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    onUpdateStatus(incident.id, 'completed', '王廠長已正式簽核授權，現場立即重啟復原。');
                    onClose();
                  }}
                  className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[13px] font-bold shadow-xs transition-colors"
                >
                  核准批覆並確認結案
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(incident.id, 'in_progress', '王廠長指示現場再行二次安全複查。');
                    onClose();
                  }}
                  className="py-2 px-4 rounded-xl bg-white border border-amber-300 text-amber-800 text-[13px] font-medium hover:bg-amber-100/50 transition-colors"
                >
                  退回再行複查
                </button>
              </div>
            </div>
          )}

          {/* 4-Pipeline Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Description & Source */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                01 · 異常簡述與感測紀錄
              </span>
              <p className="text-[14px] text-slate-800 leading-relaxed">
                {incident.description}
              </p>
            </div>

            {/* Box 2: Time & Elapsed */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                02 · 發生時間與時限管控
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-extrabold text-[#15171C] font-mono">
                  {incident.time}
                </span>
                <span className="text-[13px] text-slate-500 font-medium">
                  （已歷時 {formatElapsedTime(incident.elapsedMinutes)}）
                </span>
              </div>
              <div className="text-[12px] text-slate-500 mt-1">
                最後更新時間：<span className="font-mono text-slate-700">{incident.lastUpdated}</span>
              </div>
            </div>

            {/* Box 3: Assignee & Action */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                03 · 負責人與目前行動
              </span>
              {incident.assignee ? (
                <div>
                  <div className="text-[14px] font-bold text-slate-900">
                    {incident.assignee.name}（{incident.assignee.dept} · {incident.assignee.role}）
                  </div>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
                    {incident.handlingMethod}
                  </p>
                  <div className="mt-2 text-[12px] text-[#476EF6] font-semibold">
                    當前作為：{incident.currentAction}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold text-[13px]">尚未指派負責人</span>
                  <button
                    onClick={() => onOpenAssignModal(incident)}
                    className="py-1 px-3 rounded-lg bg-[#15171C] text-white text-[12px] font-semibold"
                  >
                    立即指派
                  </button>
                </div>
              )}
            </div>

            {/* Box 4: Current Result & Next Step */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                04 · 處置結果與後續方向
              </span>
              <div className="text-[13px] text-slate-700 space-y-1">
                <div>
                  <strong className="text-slate-900">目前結果：</strong> {incident.currentResult}
                </div>
                <div>
                  <strong className="text-slate-900">下一步：</strong> {incident.nextStep}
                </div>
                <div className="pt-1">
                  <span className="font-semibold text-slate-900">狀態：</span>
                  <span className="font-bold text-[#476EF6] ml-1">
                    {getStatusLabel(incident.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action History Log Timeline */}
          <div>
            <h3 className="text-[14px] font-bold text-[#15171C] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>事件處置完整歷史軸線 (Audit Trail)</span>
            </h3>

            <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
              {incident.historyLogs.map((log) => (
                <div key={log.id} className="relative group">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#476EF6]" />
                  <div className="text-[11px] font-mono text-slate-400">
                    {log.time} · <span className="font-semibold text-slate-700">{log.actor}</span>
                  </div>
                  <p className="text-[13px] text-slate-800 mt-0.5 leading-relaxed">
                    {log.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenAiAnalysis(incident);
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[13px] font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#C9F65B]" />
              <span>開啟 AI Agent 深度推演</span>
            </button>

            <button
              onClick={() => {
                onOpenRecordModal(incident);
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-[#15171C] hover:bg-slate-800 text-white text-[13px] font-bold flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#C9F65B]" />
              <span>產出 AI 標準紀錄</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted && (
              <button
                onClick={() => {
                  onUpdateStatus(incident.id, 'completed');
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>確認合格並結案</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-[13px] font-medium hover:bg-slate-100 transition-colors"
            >
              關閉視窗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
