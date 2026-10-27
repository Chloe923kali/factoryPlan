import React, { useState } from 'react';
import { X, Plus, AlertTriangle, Cpu, Factory } from 'lucide-react';
import { Incident, Priority, IncidentCategory } from '../types/incident';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncident: (newInc: Incident) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onAddIncident,
}) => {
  const [title, setTitle] = useState('');
  const [line, setLine] = useState('CNC 車銑加工區 (機台 CNC-04)');
  const [category, setCategory] = useState<IncidentCategory>('equipment');
  const [priority, setPriority] = useState<Priority>('high');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('SCADA 即時真空感測器');
  const [handlingMethod, setHandlingMethod] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];
    const codeNum = Math.floor(100 + Math.random() * 900);

    const newInc: Incident = {
      id: `evt-custom-${Date.now()}`,
      code: `EVT-20261026-${codeNum}`,
      title: title.trim(),
      line,
      category,
      priority,
      description: description.trim() || '現場感測數值偏離標準管制圖上限，觸發警示。',
      source,
      time: timeStr,
      date: dateStr,
      elapsedMinutes: 2,
      lastUpdated: timeStr,
      assignee: null,
      handlingMethod: handlingMethod.trim() || '尚未指派專人接洽處置。',
      currentAction: '等待派工處理',
      progressPercent: 0,
      lastReportNote: '案件剛通報進系統',
      status: 'pending',
      currentResult: '已立案，待排班處置',
      nextStep: '指派專業工程師前往機台實地排查',
      requiresManagerDecision: false,
      historyLogs: [
        {
          id: `log-init-${Date.now()}`,
          time: timeStr,
          actor: source,
          note: `事件通報建立，狀態為待處理。`,
          type: 'system',
        },
      ],
      aiAnalysis: {
        facts: [`事件於 ${timeStr} 透過 ${source} 通報。`, '尚未有專人簽收。'],
        possibleCauses: ['感測閥門氣壓波動', '消耗品耗損積碳'],
        aiInference: '初步研判為周邊輔助氣路壓力不足，建議指派巡檢人員確認供氣壓力。',
        risks: ['若延宕處置可能導致工件加工精度誤差。'],
        priorityReason: '即時通報之突發異常。',
        solutionRecommendations: [
          '立即指派製造部工程師進行現場氣壓錶校核。',
          '若氣壓持續低於 5.5 bar，啟動備用調壓閥。',
        ],
      },
    };

    onAddIncident(newInc);
    onClose();
  };

  const presetScenarios = [
    {
      title: 'SMT-02 貼片機吸嘴真空度不足',
      line: 'SMT 表面黏著線 (機台 SMT-02)',
      category: 'equipment' as const,
      priority: 'high' as const,
      desc: 'Nozzle #4 真空度低於 -70kPa，產生微小拋料現象。',
    },
    {
      title: '化學洗滌槽 pH 值超過上限',
      line: '表面處理課 (洗滌槽 W-01)',
      category: 'quality' as const,
      priority: 'critical' as const,
      desc: 'pH 達到 9.4（標準 6.5-8.0），可能有中和液滴漏過量情況。',
    },
    {
      title: '二號冷卻水塔風扇馬達異音',
      line: '公用廠務 (冷卻塔 CT-02)',
      category: 'maintenance' as const,
      priority: 'medium' as const,
      desc: '振動感測器頻譜顯示 120Hz 諧波增加，軸承需潤滑注油。',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15171C]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-[26px] shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#15171C] text-white flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#C9F65B]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#15171C]">模擬新增工廠異常事件</h3>
              <p className="text-[12px] text-slate-500">測試四欄事件流動與 AI 助理反應</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset quick test buttons */}
        <div className="p-4 bg-[#F8FAFC] border-b border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
            ⚡ 快速載入模擬情境：
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetScenarios.map((sc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(sc.title);
                  setLine(sc.line);
                  setCategory(sc.category);
                  setPriority(sc.priority);
                  setDescription(sc.desc);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-[#EEF2FF] hover:text-[#476EF6] transition-colors"
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-[12px] font-bold text-slate-800 mb-1">
              事件名稱 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：CNC-04 刀具磨耗補償超標"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-slate-800 mb-1">
                所屬產線或設備
              </label>
              <input
                type="text"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-800 mb-1">
                優先級
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30"
              >
                <option value="critical">極高優先 (Critical)</option>
                <option value="high">高優先級 (High)</option>
                <option value="medium">中度關注 (Medium)</option>
                <option value="low">常規記錄 (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-800 mb-1">
              異常簡述
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請簡述感測器讀數或現場狀況..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#476EF6]/30"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3.5 rounded-xl text-[13px] text-slate-600 hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-[#15171C] hover:bg-slate-800 text-white text-[13px] font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#C9F65B]" />
              <span>送出模擬事件</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
