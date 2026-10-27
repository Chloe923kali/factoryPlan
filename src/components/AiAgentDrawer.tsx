import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Send,
  Check,
  RefreshCw,
  Bookmark,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  TrendingDown,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { Incident } from '../types/incident';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  incidentRef?: string;
  type?: 'text' | 'analysis' | 'recommendation' | 'summary';
}

interface AiAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIncident: Incident | null;
  allIncidents: Incident[];
  onSelectIncidentForAnalysis: (inc: Incident) => void;
  onAdoptRecommendation: (incidentId: string, recommendationText: string) => void;
  onOpenRecordModal: (inc: Incident) => void;
}

export const AiAgentDrawer: React.FC<AiAgentDrawerProps> = ({
  isOpen,
  onClose,
  selectedIncident,
  allIncidents,
  onSelectIncidentForAnalysis,
  onAdoptRecommendation,
  onOpenRecordModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: '廠長您好！我是您的「廠務 AI 助理」。我已持續分析全廠感測器數據與 MES 工單進度。今日有 2 筆高優先事件需要您關注，請點選下方事件或輸入問題，我將為您提供即時決策建議。',
      timestamp: '10:45',
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adoptedRecommendations, setAdoptedRecommendations] = useState<Record<string, boolean>>({});
  const [trackedRecommendations, setTrackedRecommendations] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // When selectedIncident changes and drawer is open, add a prompt or analysis card
  useEffect(() => {
    if (selectedIncident && isOpen) {
      const existing = messages.find((m) => m.incidentRef === selectedIncident.id);
      if (!existing) {
        setMessages((prev) => [
          ...prev,
          {
            id: `diag-${selectedIncident.id}-${Date.now()}`,
            sender: 'ai',
            text: `已調閱【${selectedIncident.line}】之【${selectedIncident.title}】即時數據與處置日誌。請檢視下方診斷與建議處置方案：`,
            timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            incidentRef: selectedIncident.id,
            type: 'analysis',
          },
        ]);
      }
    }
  }, [selectedIncident, isOpen]);

  const quickQuestions = [
    '今天有哪些異常？',
    '哪些事件尚未處理？',
    '哪些問題最影響產能？',
    '幫我整理今日廠務報告',
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr,
      type: 'text',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAnalyzing(true);

    // Simulate AI intelligent reasoning
    setTimeout(() => {
      let aiResponseText = '';

      if (text.includes('有哪些異常') || text.includes('今天有哪些異常')) {
        const criticalCount = allIncidents.filter((i) => i.priority === 'critical' || i.priority === 'high').length;
        aiResponseText = `報告廠長，今日目前總計發生 ${allIncidents.length} 筆事件：\n` +
          `• 🔴 高風險與極高優先：共 ${criticalCount} 筆（包含 CNC-03 高溫與 A02 產線良率異常）。\n` +
          `• 🟡 待廠長簽核決策：包裝線 CV-01 復歸啟動、原料高溫密封圈急件採購。\n` +
          `• 🟢 已順利結案：空壓機房 AC-02 雙週例行保養已完成。`;
      } else if (text.includes('尚未處理') || text.includes('哪些事件尚未處理')) {
        const pendingItems = allIncidents.filter((i) => i.status === 'pending' || !i.assignee);
        aiResponseText = `經查核，目前全廠有 ${pendingItems.length} 筆處置掛置案件：\n` +
          `【EVT-006 班別交接紀錄缺漏】目前尚未指派專人接洽！建議您立即指派早班副組長「李家豪」於 30 分鐘內落實檢核補簽。`;
      } else if (text.includes('影響產能') || text.includes('最影響產能')) {
        aiResponseText = `經產線瓶頸與稼動率關聯度模型評估：\n` +
          `1. 【第一瓶頸】：CNC-03 主軸溫度過高。若停機超過 60 分鐘，將影響航太組件交付，建議採納「動態轉移 24 件至 CNC-05 備援」。\n` +
          `2. 【第二瓶頸】：A02 精密組裝線焊點不良率竄升，若未在 11:15 前排除鋼板積碳，可能產生 250 片重工代價。`;
      } else if (text.includes('廠務報告') || text.includes('整理今日廠務報告')) {
        aiResponseText = `已為您自動彙整「10/26 智慧製造第一廠 廠長晨間總結摘要」：\n` +
          `• 全廠稼動率：91.4%（受 CNC-03 與包裝線暫停影響微跌 2.1%）\n` +
          `• 總案件：${allIncidents.length} 件｜處理中 2 件｜待決策 2 件｜已結案 1 件\n` +
          `• AI 處置建言：請優先批覆包裝線重啟與密封圈外購核准，即可迅速將稼動率拉回 94% 水準。`;
      } else {
        aiResponseText = `收到廠長的指示：「${text}」。\n已為您比對目前廠區 SCADA 感測數據與 MES 排程，整體處置流程均在管控範圍內。如需針對特定設備進行深層根因推演，可隨時點擊各事件之【交給 AI 分析】。`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          type: 'text',
        },
      ]);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleAdopt = (incidentId: string, recText: string) => {
    setAdoptedRecommendations((prev) => ({ ...prev, [`${incidentId}-${recText}`]: true }));
    onAdoptRecommendation(incidentId, recText);
  };

  const handleTrack = (incidentId: string, recText: string) => {
    setTrackedRecommendations((prev) => ({
      ...prev,
      [`${incidentId}-${recText}`]: !prev[`${incidentId}-${recText}`],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#15171C]/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-white via-[#F8FAFC] to-[#EEF2FF]">
          <div className="flex items-center gap-3">
            {/* Cute AI Bot Icon in Header */}
            <div className="w-10 h-10 rounded-2xl bg-[#15171C] border border-slate-700 flex items-center justify-center relative shadow-sm">
              <Bot className="w-5 h-5 text-[#C9F65B]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#476EF6] ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-[#15171C]">廠務 AI 助理</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15171C] text-[#C9F65B] uppercase">
                  ACTIVE AGENT
                </span>
              </div>
              <p className="text-[12px] text-slate-500 font-medium">
                智慧診斷 · 根因推演 · 處置方案推薦 · 紀錄標準化
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'ai',
                    text: '已重置對話紀錄。目前全廠事件中心持續連線監控中，請隨時下達指令。',
                    timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                    type: 'text',
                  },
                ]);
              }}
              title="清除對話紀錄"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[#15171C] rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Incident Context Selector Strip */}
        <div className="px-5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto text-[12px]">
          <span className="text-slate-400 shrink-0 font-medium">診斷焦點事件：</span>
          {allIncidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => onSelectIncidentForAnalysis(inc)}
              className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-all ${
                selectedIncident?.id === inc.id
                  ? 'bg-[#476EF6] text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {inc.code} ({inc.line.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Scrollable Conversation & Analysis Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Feature A: Smart Overall Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#15171C] to-[#252A36] text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#476EF6]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#C9F65B] uppercase">
                FEATURE A · 事件智慧摘要
              </span>
              <Sparkles className="w-4 h-4 text-[#C9F65B]" />
            </div>

            <p className="text-[14px] font-medium leading-relaxed text-slate-100">
              報告廠長：目前第一廠區共有 <span className="font-bold text-[#C9F65B] font-mono text-[16px]">6 筆事件</span>
              ，其中 <span className="font-bold text-red-400 font-mono text-[16px]">2 筆</span> 需要優先關注（CNC-03 主軸過熱、A02 良率波動），另有 2 筆正等待您的授權決策。
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-slate-300">
              <span>全廠連鎖停機風險：<strong className="text-emerald-400">極低（已實施安全隔離）</strong></span>
              <span className="text-slate-400">每 30 秒動態覆核</span>
            </div>
          </div>

          {/* Active Incident Deep Diagnostics Card (Feature B & C) */}
          {selectedIncident && selectedIncident.aiAnalysis && (
            <div className="p-5 rounded-[22px] bg-white border-2 border-[#476EF6]/30 shadow-lg shadow-[#476EF6]/5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#476EF6] animate-pulse" />
                  <span className="text-[14px] font-bold text-[#15171C]">
                    【{selectedIncident.code}】{selectedIncident.title} 深度分析
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#476EF6]">
                  {selectedIncident.line}
                </span>
              </div>

              {/* Feature B: Cause Analysis */}
              <div className="space-y-3">
                {/* 1. Confirmed facts */}
                <div>
                  <h4 className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>已確認事實 (Confirmed Facts)</span>
                  </h4>
                  <ul className="space-y-1 pl-5 list-disc text-[12px] text-slate-700">
                    {selectedIncident.aiAnalysis.facts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. Possible causes */}
                <div>
                  <h4 className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>可能原因 (Possible Causes)</span>
                  </h4>
                  <ul className="space-y-1 pl-5 list-disc text-[12px] text-slate-700">
                    {selectedIncident.aiAnalysis.possibleCauses.map((cause, idx) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>

                {/* 3. AI Inference */}
                <div className="p-3 bg-[#EEF2FF]/70 rounded-xl border border-[#C7D2FE]/60">
                  <span className="text-[11px] font-bold text-[#476EF6] uppercase block mb-1">
                    🤖 AI 核心推測 (AI Hypothesis)
                  </span>
                  <p className="text-[12px] font-medium text-slate-800 leading-relaxed">
                    {selectedIncident.aiAnalysis.aiInference}
                  </p>
                </div>

                {/* 4. Potential Risks & Priority */}
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                    <span className="font-bold text-red-800 block mb-1">⚠️ 潛在生產風險</span>
                    <p className="text-red-700 leading-snug">
                      {selectedIncident.aiAnalysis.risks[0]}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">🎯 建議優先順序</span>
                    <p className="text-slate-600 leading-snug">
                      {selectedIncident.aiAnalysis.priorityReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature C: Solution Recommendations */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-[13px] font-bold text-[#15171C] flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>AI 解決方案建議 (Actionable Solutions)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">需廠長核定授權</span>
                </div>

                <div className="space-y-2.5">
                  {selectedIncident.aiAnalysis.solutionRecommendations.map((rec, idx) => {
                    const isAdopted =
                      adoptedRecommendations[`${selectedIncident.id}-${rec}`] ||
                      (selectedIncident.aiAnalysis?.adopted && selectedIncident.aiAnalysis?.adoptedAction === rec);
                    const isTracked = trackedRecommendations[`${selectedIncident.id}-${rec}`];

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          isAdopted
                            ? 'bg-emerald-50/80 border-emerald-300'
                            : 'bg-[#F8FAFC] border-slate-200 hover:border-[#476EF6]/40'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#15171C] text-[#C9F65B] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-[12px] font-medium text-slate-800 leading-relaxed flex-1">
                            {rec}
                          </p>
                        </div>

                        {/* Action buttons per recommendation */}
                        <div className="flex items-center gap-2 mt-2.5 pl-7">
                          {isAdopted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              <Check className="w-3.5 h-3.5" />
                              已採納此方案並下達產線
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAdopt(selectedIncident.id, rec)}
                              className="py-1 px-3 rounded-lg bg-[#476EF6] hover:bg-[#3B5ED8] text-white text-[11px] font-bold transition-colors shadow-xs"
                            >
                              採納建議
                            </button>
                          )}

                          <button
                            onClick={() => handleTrack(selectedIncident.id, rec)}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-medium border transition-colors ${
                              isTracked
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Bookmark className="w-3 h-3 inline mr-1" />
                            {isTracked ? '已加入追蹤' : '加入追蹤'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feature D: AI Auto Record Generation Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[12px] text-slate-500">
                    由 AI 依據目前處置狀態，產出標準化 ISO-9001 事件紀錄
                  </div>
                  <button
                    onClick={() => onOpenRecordModal(selectedIncident)}
                    className="py-2 px-3.5 rounded-xl bg-[#15171C] hover:bg-slate-800 text-white text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C9F65B]" />
                    <span>交給 AI 紀錄</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Chat Messages */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              對話紀錄與即時諮詢
            </div>

            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {isAi ? (
                    <div className="w-8 h-8 rounded-full bg-[#15171C] text-[#C9F65B] flex items-center justify-center shrink-0 text-[12px] font-bold shadow-xs">
                      AI
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#476EF6] text-white flex items-center justify-center shrink-0 text-[12px] font-bold shadow-xs">
                      王
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-[13px] leading-relaxed ${
                      isAi
                        ? 'bg-[#F8FAFC] text-slate-800 border border-slate-200/80 shadow-xs'
                        : 'bg-[#476EF6] text-white font-medium shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[10px] block mt-1.5 text-right font-mono ${
                        isAi ? 'text-slate-400' : 'text-blue-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isAnalyzing && (
              <div className="flex gap-3 items-center text-[12px] text-slate-500 pl-2">
                <div className="w-6 h-6 rounded-full bg-[#15171C] text-[#C9F65B] flex items-center justify-center text-[10px] animate-spin">
                  ✦
                </div>
                <span>廠務 AI 助理正在研判感測數據與工單紀錄...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions Chips */}
        <div className="p-3 bg-[#F8FAFC] border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 mb-1.5 px-1">
            快捷提問建議：
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#EEF2FF] hover:text-[#476EF6] border border-slate-200 text-[12px] text-slate-600 transition-colors shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="輸入問題，例如「哪些產線有超時風險？」或指示 AI..."
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#15171C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30 focus:border-[#476EF6]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="py-2.5 px-4 rounded-xl bg-[#476EF6] hover:bg-[#3B5ED8] disabled:bg-slate-200 text-white font-bold text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>發送</span>
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            AI 助理僅提供決策建議，實際機台停啟、調機與結案須由授權主管或廠長確認。
          </p>
        </div>
      </div>
    </div>
  );
};
