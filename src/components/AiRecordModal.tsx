import React, { useState } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Printer, Download, Sparkles } from 'lucide-react';
import { Incident } from '../types/incident';
import { generateAiRecord } from '../utils/incidentLogic';

interface AiRecordModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: (incidentId: string, record: any) => void;
}

export const AiRecordModal: React.FC<AiRecordModalProps> = ({
  incident,
  isOpen,
  onClose,
  onConfirmSave,
}) => {
  if (!isOpen || !incident) return null;

  const [isSaved, setIsSaved] = useState(false);
  const record = incident.aiGeneratedRecord || generateAiRecord(incident, '王廠長');

  const handleConfirm = () => {
    setIsSaved(true);
    setTimeout(() => {
      onConfirmSave(incident.id, record);
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15171C]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#15171C] text-white flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#C9F65B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#15171C]">
                  AI 標準化事件紀錄預覽
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ISO-9001 檢驗標準
                </span>
              </div>
              <p className="text-[12px] text-slate-500 font-medium">
                由廠務 AI 助理自動萃取並編制之正式報告檔案
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Content View */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Official Stamp Banner */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-slate-700">智慧製造第一廠 · 廠長室事件歸檔案卷</span>
              <span className="text-[11px] font-mono text-slate-400">核定編號: {incident.code}-DOC</span>
            </div>
            <p className="text-[13px] font-semibold text-[#15171C] leading-snug">
              {record.summary}
            </p>
          </div>

          {/* Formatted Content */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-[13px] leading-relaxed text-slate-800 whitespace-pre-line font-sans">
            {record.content}
          </div>

          {/* AI Key takeaways */}
          <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] space-y-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#476EF6] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#476EF6]" />
              <span>AI 關鍵提要與後續改善建議</span>
            </div>
            <ul className="space-y-1 pl-5 list-disc text-[12px] text-slate-700">
              {record.keyTakeaways.map((takeaway, idx) => (
                <li key={idx}>{takeaway}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <div className="text-[12px] text-slate-400 font-mono">
            簽核主管：王廠長（最高權限）
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-200"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSaved}
              className="py-2.5 px-5 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[13px] font-bold shadow-xs transition-all flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#C9F65B] animate-spin" />
                  <span>正式簽核歸檔中...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C9F65B]" />
                  <span>確認簽核並正式歸檔</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
