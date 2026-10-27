import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Activity,
  Cpu,
  ShieldCheck,
  Users,
  Bot,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight,
  Factory,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenAiDrawer: () => void;
  incidentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAiDrawer,
  incidentCount,
}) => {
  const menuItems = [
    { id: 'overview', label: '工廠總覽', icon: LayoutDashboard },
    { id: 'incidents', label: '事件管理', icon: AlertTriangle, badge: incidentCount },
    { id: 'production', label: '生產監控', icon: Activity },
    { id: 'equipment', label: '設備狀態', icon: Cpu },
    { id: 'quality', label: '品質管理', icon: ShieldCheck },
    { id: 'personnel', label: '人員與排程', icon: Users },
    { id: 'ai-records', label: 'AI Agent 工作紀錄', icon: Bot, isAi: true },
    { id: 'analytics', label: '報表分析', icon: BarChart3 },
    { id: 'settings', label: '系統設定', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Brand & Logo Header */}
      <div>
        <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#476EF6] flex items-center justify-center text-white shadow-sm shadow-[#476EF6]/30">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[17px] tracking-tight text-[#15171C]">
                  COMMAND
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#15171C] text-white">
                  OS
                </span>
              </div>
              <p className="text-[12px] font-medium text-slate-400">智慧工廠事件指揮中心</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            核心系統功能
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all group ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#476EF6] font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-[#F8FAFC] hover:text-[#15171C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#476EF6] text-white'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#476EF6] text-white'
                        : 'bg-[#F1F5F9] text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.isAi && (
                  <span className="w-2 h-2 rounded-full bg-[#C9F65B] ring-2 ring-emerald-400/40 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Quick Banner at Bottom */}
      <div className="p-4 border-t border-[#F1F5F9] space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#15171C] to-[#242933] text-white relative overflow-hidden shadow-md">
          {/* Subtle neon lime accent glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9F65B]/15 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C9F65B] animate-ping" />
              <span className="text-[11px] font-bold tracking-wider text-[#C9F65B] uppercase">
                AI AGENT 在線
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#C9F65B]" />
          </div>

          <p className="text-[13px] font-semibold text-slate-100 leading-snug">
            廠務智慧助理
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            即時監測全廠異常，主動建議應變方案。
          </p>

          <button
            onClick={onOpenAiDrawer}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>召喚 AI 助理</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* System info */}
        <div className="px-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>第一廠區 SCADA 聯網</span>
          <span className="font-mono text-emerald-600 font-semibold">100% 正常</span>
        </div>
      </div>
    </aside>
  );
};
