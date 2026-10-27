import React, { useState } from 'react';
import { X, UserPlus, Check, Phone } from 'lucide-react';
import { Incident, Assignee } from '../types/incident';
import { AVAILABLE_STAFF } from '../data/initialIncidents';

interface AssignPersonnelModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (incidentId: string, assignee: Assignee, methodNote?: string) => void;
}

export const AssignPersonnelModal: React.FC<AssignPersonnelModalProps> = ({
  incident,
  isOpen,
  onClose,
  onAssign,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<Assignee>(AVAILABLE_STAFF[0]);
  const [methodNote, setMethodNote] = useState('');

  if (!isOpen || !incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(incident.id, selectedStaff, methodNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15171C]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-[26px] shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#15171C] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#C9F65B]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#15171C]">指派事件負責專員</h3>
              <p className="text-[12px] text-slate-500">{incident.code} · {incident.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-slate-900 mb-2">
              選擇現場責任人或主管：
            </label>
            <div className="space-y-2">
              {AVAILABLE_STAFF.map((staff) => {
                const isSelected = selectedStaff.name === staff.name;
                return (
                  <div
                    key={staff.name}
                    onClick={() => setSelectedStaff(staff)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#476EF6] bg-[#EEF2FF] shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#15171C] text-white font-bold text-[13px] flex items-center justify-center">
                        {staff.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-[#15171C]">{staff.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                            {staff.dept}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-slate-400 mt-0.5">
                          <span>{staff.role}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 font-mono">
                            <Phone className="w-3 h-3" />
                            {staff.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#476EF6] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-900 mb-1.5">
              指示處置方式或備註：
            </label>
            <textarea
              rows={3}
              value={methodNote}
              onChange={(e) => setMethodNote(e.target.value)}
              placeholder="例如：請立即查訪夜班沖壓二課模具保養紙本工單，並於 30 分鐘內於系統完成數位核定。"
              className="w-full p-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30 focus:border-[#476EF6]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              取消
            </button>
            <button
              id="confirm-assign-btn"
              type="submit"
              aria-label="確定指派人員"
              className="py-2.5 px-5 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[13px] font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#C9F65B]" />
              <span>確定指派並下達任務</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
