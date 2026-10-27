import React from 'react';
import {
  Activity,
  Cpu,
  ShieldCheck,
  Users,
  Bot,
  BarChart3,
  Settings,
  LayoutDashboard,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Incident } from '../types/incident';

interface OtherTabsViewProps {
  currentTab: string;
  onNavigateToIncidents: () => void;
  incidents: Incident[];
  onOpenAiDrawer: () => void;
}

export const OtherTabsView: React.FC<OtherTabsViewProps> = ({
  currentTab,
  onNavigateToIncidents,
  incidents,
  onOpenAiDrawer,
}) => {
  if (currentTab === 'ai-records') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-[26px] p-6 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#15171C] text-white flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#C9F65B]" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#15171C]">AI Agent 智慧工作日誌與分析審計</h2>
                <p className="text-[13px] text-slate-500">記錄全廠 AI 推演推播、廠長核准決策與防範對策歷史</p>
              </div>
            </div>

            <button
              onClick={onOpenAiDrawer}
              className="py-2 px-4 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[13px] font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C9F65B]" />
              <span>開啟 AI 對話面板</span>
            </button>
          </div>

          {/* AI Task Activity Log */}
          <div className="divide-y divide-slate-100">
            {incidents.map((inc) => (
              <div key={inc.id} className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {inc.code}
                    </span>
                    <span className="text-[14px] font-bold text-[#15171C]">{inc.title}</span>
                    <span className="text-[11px] text-[#476EF6] font-medium">{inc.line}</span>
                  </div>
                  <p className="text-[13px] text-slate-600">
                    🤖 <strong>AI 核心推論：</strong> {inc.aiAnalysis?.aiInference || '已建立異常監控模型'}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    💡 <strong>推薦對策：</strong> {inc.aiAnalysis?.solutionRecommendations[0] || '依 SOP 巡檢'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">{inc.time} 紀錄</span>
                  {inc.aiAnalysis?.adopted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      廠長已採納
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">待廠長審閱</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for other tabs with clean quick-return to Incident Command Center
  const tabTitles: Record<string, { title: string; subtitle: string; icon: any }> = {
    overview: { title: '工廠綜合總覽', subtitle: '第一廠區全盤運營與即時稼動率', icon: LayoutDashboard },
    production: { title: '生產監控線控', subtitle: 'CNC、精密組裝與包裝線即時良率曲線', icon: Activity },
    equipment: { title: '設備狀態總覽', subtitle: '42 台主機設備健康度與振動頻譜', icon: Cpu },
    quality: { title: '品質 SPC 管理', subtitle: 'AOI 光學檢驗與焊點缺陷分佈統計', icon: ShieldCheck },
    personnel: { title: '人員與班別排程', subtitle: '日夜輪班值班工程師與執勤簽核', icon: Users },
    analytics: { title: '報表與趨勢分析', subtitle: '月度設備妥善率 (MTBF / MTTR) 分析', icon: BarChart3 },
    settings: { title: '系統設定與閥值', subtitle: 'SCADA 警報閾值、AI 授權原則與權限', icon: Settings },
  };

  const currentInfo = tabTitles[currentTab] || {
    title: '工廠管理子系統',
    subtitle: '系統維護中',
    icon: LayoutDashboard,
  };

  const Icon = currentInfo.icon;

  return (
    <div className="bg-white rounded-[26px] p-10 border border-[#E2E8F0] shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 rounded-3xl bg-[#EEF2FF] text-[#476EF6] flex items-center justify-center mx-auto shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-[20px] font-bold text-[#15171C]">{currentInfo.title}</h2>
      <p className="text-[14px] text-slate-500 leading-relaxed max-w-md mx-auto">
        {currentInfo.subtitle}。依據系統規劃，目前優先聚焦於核心<strong>「廠長事件管理首頁」</strong>。
      </p>

      <div className="pt-4">
        <button
          onClick={onNavigateToIncidents}
          className="py-2.5 px-5 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[13px] font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>返回「事件管理中心」核心四欄</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
