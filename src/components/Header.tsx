import React, { useState, useEffect } from 'react';
import {
  Factory,
  ChevronDown,
  Bell,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  X,
  ExternalLink,
} from 'lucide-react';
import { Incident } from '../types/incident';

interface HeaderProps {
  onOpenAiDrawer: () => void;
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAiDrawer,
  incidents,
  onSelectIncident,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [selectedFactory, setSelectedFactory] = useState<string>('智慧製造第一廠 (北部總部)');
  const [showFactoryMenu, setShowFactoryMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'narrow' });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const factories = [
    '智慧製造第一廠 (北部總部)',
    '智慧製造第二廠 (高雄精密加工廠)',
    '智慧製造第三廠 (越南海外廠)',
  ];

  // Urgent alerts for notification center
  const urgentIncidents = incidents.filter(
    (i) => i.status !== 'completed' && (i.priority === 'critical' || i.requiresManagerDecision)
  );

  return (
    <header className="h-20 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left zone: Factory selector & Title */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="relative shrink-0">
          <button
            onClick={() => setShowFactoryMenu(!showFactoryMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[13px] font-semibold text-[#15171C] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Factory className="w-4 h-4 text-[#476EF6] shrink-0" />
            <span className="whitespace-nowrap">{selectedFactory}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showFactoryMenu && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase">
                切換廠區視圖
              </div>
              {factories.map((fac) => (
                <button
                  key={fac}
                  onClick={() => {
                    setSelectedFactory(fac);
                    setShowFactoryMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between ${
                    selectedFactory === fac
                      ? 'bg-[#EEF2FF] text-[#476EF6] font-semibold'
                      : 'text-slate-700 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span>{fac}</span>
                  {selectedFactory === fac && <CheckCircle2 className="w-4 h-4 text-[#476EF6]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* Page title */}
        <div>
          <h1 className="text-[20px] font-bold text-[#15171C] tracking-tight flex items-center gap-2">
            <span>工廠事件中心</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#15171C] text-[#C9F65B]">
              即時連線中
            </span>
          </h1>
        </div>
      </div>

      {/* Right zone: Live Time, AI Agent Status, Notifications, User Profile */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Date and Live Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-slate-600 font-mono tabular-nums whitespace-nowrap shrink-0">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{currentDate}</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-[#15171C]">{currentTime || '10:45:00'}</span>
        </div>

        {/* AI Agent Status Pill */}
        <button
          onClick={onOpenAiDrawer}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] transition-colors group cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#476EF6]" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-[#476EF6] animate-ping opacity-75" />
          </div>
          <span className="text-[13px] font-bold text-[#476EF6]">
            AI Agent 全時待命
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#476EF6] group-hover:rotate-12 transition-transform shrink-0" />
        </button>

        {/* Notification Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-slate-600 hover:text-[#15171C] transition-colors relative cursor-pointer"
            aria-label="廠務通知"
          >
            <Bell className="w-4 h-4" />
            {urgentIncidents.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {urgentIncidents.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-88 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#15171C]">
                  廠務即時警示 ({urgentIncidents.length})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentIncidents.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-[13px]">
                    目前全廠無重大緊急事件
                  </div>
                ) : (
                  urgentIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        onSelectIncident(inc);
                        setShowNotifications(false);
                      }}
                      className="p-3.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-700">
                          {inc.priority === 'critical' ? '極高風險' : '待廠長覆核'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{inc.time}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-[#15171C] mt-1 line-clamp-1">
                        {inc.title}
                      </p>
                      <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-1">
                        {inc.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile (王廠長) */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 whitespace-nowrap shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#15171C] to-[#476EF6] text-white flex items-center justify-center font-bold text-[14px] shadow-sm shrink-0">
            王
          </div>
          <div className="text-left shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[14px] font-bold text-[#15171C] whitespace-nowrap">王廠長</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#EEF2FF] text-[#476EF6] border border-[#C7D2FE] whitespace-nowrap">
                PLANT HEAD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">全廠最高指揮權限</p>
          </div>
        </div>
      </div>
    </header>
  );
};
