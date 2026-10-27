import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, Bot, MessageSquare } from 'lucide-react';
import { Incident } from '../types/incident';

interface AiAgentWidgetProps {
  onOpenDrawer: (targetIncident?: Incident) => void;
  incidents: Incident[];
  isDrawerOpen: boolean;
}

export const AiAgentWidget: React.FC<AiAgentWidgetProps> = ({
  onOpenDrawer,
  incidents,
  isDrawerOpen,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Find the top critical or overdue incident for proactive alert
  const proactiveIncident = incidents.find(
    (i) => i.status !== 'completed' && (i.priority === 'critical' || i.status === 'overdue')
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none select-none">
      {/* Proactive Speech Bubble (AI 主動提醒) */}
      {!isDrawerOpen && !isAlertDismissed && proactiveIncident && (
        <div className="pointer-events-auto mb-3 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#476EF6]/30 shadow-xl shadow-[#476EF6]/10 animate-fade-in relative transition-all">
          {/* Subtle triangle arrow pointing to the bot */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white rotate-45 border-r border-b border-[#476EF6]/30" />

          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C9F65B] ring-2 ring-emerald-400" />
              <span className="text-[11px] font-bold tracking-wider text-[#476EF6] uppercase">
                AI 主動分析推播
              </span>
            </div>
            <button
              onClick={() => setIsAlertDismissed(true)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              title="稍後處理"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[13px] font-medium text-slate-800 leading-relaxed">
            廠長，<span className="font-bold text-[#476EF6]">{proactiveIncident.line}</span> 的
            「{proactiveIncident.title}」已持續歷時{' '}
            <span className="font-bold text-red-600 font-mono">
              {proactiveIncident.elapsedMinutes} 分鐘
            </span>
            ，我已為您整理出 3 項建議對策。
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => {
                onOpenDrawer(proactiveIncident);
                setIsAlertDismissed(true);
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[12px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9F65B]" />
              <span>查看 AI 建議</span>
            </button>
            <button
              onClick={() => setIsAlertDismissed(true)}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[12px] font-medium transition-colors"
            >
              稍後處理
            </button>
          </div>
        </div>
      )}

      {/* Floating Robot Character (圓潤科技感機器人) */}
      <div
        className="pointer-events-auto relative group cursor-pointer"
        onClick={() => onOpenDrawer(proactiveIncident)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Breathing aura / halo ring */}
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-[#476EF6]/30 via-[#C9F65B]/20 to-[#476EF6]/40 blur-md animate-pulse group-hover:scale-110 transition-transform duration-500" />

        {/* Robot Body Capsule */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-white to-[#F1F5F9] border-2 border-[#476EF6] shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {/* Robot Visor / Screen Face */}
          <div className="w-11 h-9 rounded-2xl bg-[#15171C] flex items-center justify-center relative overflow-hidden border border-slate-700">
            {/* Expressive Glowing Eyes */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2 h-3 rounded-full bg-[#C9F65B] shadow-[0_0_8px_#C9F65B] transition-all duration-200 ${
                  isHovered ? 'scale-y-75' : ''
                }`}
              />
              <div
                className={`w-2 h-3 rounded-full bg-[#C9F65B] shadow-[0_0_8px_#C9F65B] transition-all duration-200 ${
                  isHovered ? 'scale-y-75' : ''
                }`}
              />
            </div>

            {/* Subtle scanning light bar */}
            <div className="absolute top-0 bottom-0 w-1 bg-white/20 blur-[1px] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          </div>

          {/* Tiny antenna on top with Tech Blue bead */}
          <div className="absolute -top-1.5 w-2 h-2 rounded-full bg-[#476EF6] border border-white" />

          {/* Notification bubble badge if there are urgent incidents */}
          {proactiveIncident && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C9F65B] text-[#15171C] border-2 border-white text-[11px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
              !
            </span>
          )}
        </div>

        {/* Floating tooltip label on hover */}
        {isHovered && !isDrawerOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#15171C] text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700">
            開啟「廠務 AI 助理」
          </div>
        )}
      </div>
    </div>
  );
};
