export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus = 
  | 'pending'           // 待處理
  | 'in_progress'       // 處理中
  | 'awaiting_manager'  // 等待確認 / 待廠長決策
  | 'completed'         // 已完成
  | 'overdue';          // 逾時未解決

export type IncidentCategory = 
  | 'equipment'   // 設備異常
  | 'quality'     // 品質製程
  | 'inventory'   // 物料庫存
  | 'maintenance' // 保養維護
  | 'safety'      // 工安環境
  | 'operation';  // 人員交接

export interface Assignee {
  name: string;
  avatarText?: string;
  dept: string;
  role: string;
  phone?: string;
}

export interface AiAnalysisData {
  facts: string[];
  possibleCauses: string[];
  aiInference: string;
  risks: string[];
  priorityReason: string;
  solutionRecommendations: string[];
  adopted?: boolean;
  adoptedTime?: string;
  adoptedAction?: string;
}

export interface HistoryLog {
  id: string;
  time: string;
  actor: string;
  note: string;
  type: 'system' | 'assignee' | 'manager' | 'ai';
}

export interface AiGeneratedRecord {
  summary: string;
  confirmedBy?: string;
  confirmedAt?: string;
  content: string;
  keyTakeaways: string[];
}

export interface Incident {
  id: string;
  code: string;                 // e.g., EVT-20261026-001
  title: string;                // e.g., CNC-03 主軸溫度過高
  line: string;                 // 所屬產線或設備 (e.g. CNC-03, A02 產線)
  category: IncidentCategory;   // 類型
  priority: Priority;           // 優先級
  description: string;          // 異常簡述
  source: string;               // 事件來源 (SCADA感測器, MES系統, etc.)
  time: string;                 // 發生時間 (HH:mm)
  date: string;                 // 日期
  elapsedMinutes: number;       // 已經過時間（分鐘）
  lastUpdated: string;          // 最近更新時間
  assignee: Assignee | null;    // 處理人員，null 表示尚未指派
  handlingMethod: string;       // 處理方式
  currentAction: string;        // 目前執行動作
  progressPercent: number;      // 處理進度 (0-100)
  lastReportNote: string;       // 最後回報內容
  status: IncidentStatus;       // 現在狀態
  currentResult: string;        // 目前結果
  nextStep: string;             // 下一步處置
  requiresManagerDecision: boolean; // 是否需要廠長決策
  managerDecisionPrompt?: string;   // 廠長決策提問
  aiAnalysis?: AiAnalysisData;
  historyLogs: HistoryLog[];
  aiGeneratedRecord?: AiGeneratedRecord;
}

export interface IncidentSummaryStats {
  total: number;
  inProgress: number;
  awaitingManager: number;
  completed: number;
  overdue: number;
  criticalCount: number;
}
