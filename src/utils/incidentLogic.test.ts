import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSummaryStats,
  formatElapsedTime,
  filterAndSortIncidents,
  updateIncidentStatus,
  assignPersonnel,
  adoptAiRecommendation,
  generateAiRecord,
} from './incidentLogic';
import { Incident } from '../types/incident';

const mockIncidents: Incident[] = [
  {
    id: '1',
    code: 'EVT-001',
    title: 'CNC-03 主軸溫度過高',
    line: 'CNC-03',
    category: 'equipment',
    priority: 'high',
    description: '主軸溫度達 68°C',
    source: 'SCADA',
    time: '10:42',
    date: '2026-10-26',
    elapsedMinutes: 35,
    lastUpdated: '10:55',
    assignee: { name: '陳志明', dept: '設備工程處', role: '設備工程師' },
    handlingMethod: '已停機檢查冷卻系統',
    currentAction: '正在確認主軸散熱功能',
    progressPercent: 65,
    lastReportNote: '散熱液流量偏低',
    status: 'in_progress',
    currentResult: '持續降溫中',
    nextStep: '待溫度降至 45°C 以下重啟試車',
    requiresManagerDecision: false,
    historyLogs: [],
  },
  {
    id: '2',
    code: 'EVT-002',
    title: '包裝線輸送帶異常停機',
    line: '包裝線01',
    category: 'equipment',
    priority: 'high',
    description: '輸送帶卡件停擺',
    source: 'MES',
    time: '09:15',
    date: '2026-10-26',
    elapsedMinutes: 82,
    lastUpdated: '09:40',
    assignee: { name: '許文彬', dept: '製造一部', role: '包裝線領班' },
    handlingMethod: '清除異物排除卡塞',
    currentAction: '等待廠長覆核重啟指令',
    progressPercent: 90,
    lastReportNote: '異物已清除完畢',
    status: 'awaiting_manager',
    currentResult: '卡件已清除，等待重啟',
    nextStep: '請廠長簽核復原連線運轉',
    requiresManagerDecision: true,
    historyLogs: [],
  },
  {
    id: '3',
    code: 'EVT-003',
    title: '空壓設備定期保養',
    line: '動力廠房',
    category: 'maintenance',
    priority: 'low',
    description: '例行巡檢濾網與油位',
    source: 'CMMS',
    time: '09:30',
    date: '2026-10-26',
    elapsedMinutes: 67,
    lastUpdated: '10:00',
    assignee: { name: '郭冠宇', dept: '廠務公用處', role: '廠務工程師' },
    handlingMethod: '依據 SOP 進行濾網更換',
    currentAction: '已完成保養作業',
    progressPercent: 100,
    lastReportNote: '濾芯已更換，油位檢測正常',
    status: 'completed',
    currentResult: '保養完成',
    nextStep: '歸檔記錄',
    requiresManagerDecision: false,
    historyLogs: [],
  },
  {
    id: '4',
    code: 'EVT-004',
    title: '班別交接紀錄缺漏',
    line: '全廠管理',
    category: 'operation',
    priority: 'medium',
    description: '夜班轉日班紀錄缺簽章',
    source: '現場巡檢',
    time: '08:50',
    date: '2026-10-26',
    elapsedMinutes: 107,
    lastUpdated: '08:50',
    assignee: null,
    handlingMethod: '尚未指派專人補正',
    currentAction: '等待指派領班確認',
    progressPercent: 0,
    lastReportNote: '尚未有回報',
    status: 'pending',
    currentResult: '尚未處理',
    nextStep: '指派早班副組長補填確認',
    requiresManagerDecision: false,
    historyLogs: [],
  },
];

test('calculateSummaryStats returns accurate counts', () => {
  const stats = calculateSummaryStats(mockIncidents);
  assert.equal(stats.total, 4);
  assert.equal(stats.inProgress, 1);
  assert.equal(stats.awaitingManager, 1);
  assert.equal(stats.completed, 1);
  assert.equal(stats.criticalCount, 2);
});

test('formatElapsedTime converts minutes to human readable string', () => {
  assert.equal(formatElapsedTime(0), '剛發生');
  assert.equal(formatElapsedTime(35), '35 分鐘前');
  assert.equal(formatElapsedTime(60), '1 小時前');
  assert.equal(formatElapsedTime(85), '1 小時 25 分前');
});

test('filterAndSortIncidents filters by search query and category', () => {
  const searchResults = filterAndSortIncidents(mockIncidents, { search: 'CNC' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].code, 'EVT-001');

  const maintResults = filterAndSortIncidents(mockIncidents, { category: 'maintenance' });
  assert.equal(maintResults.length, 1);
  assert.equal(maintResults[0].code, 'EVT-003');
});

test('updateIncidentStatus completes incident and resets decision flag', () => {
  const updated = updateIncidentStatus(mockIncidents, '2', 'completed', '王廠長', '核准復歸運轉');
  const target = updated.find((i) => i.id === '2');
  assert.ok(target);
  assert.equal(target.status, 'completed');
  assert.equal(target.requiresManagerDecision, false);
  assert.equal(target.progressPercent, 100);
  assert.ok(target.historyLogs.length > 0);
});

test('assignPersonnel assigns staff and updates status to in_progress', () => {
  const updated = assignPersonnel(mockIncidents, '4', {
    name: '李家豪',
    dept: '製造一部',
    role: '值班副組長',
  });
  const target = updated.find((i) => i.id === '4');
  assert.ok(target);
  assert.equal(target.assignee?.name, '李家豪');
  assert.equal(target.status, 'in_progress');
});

test('adoptAiRecommendation updates incident action and marks aiAnalysis adopted', () => {
  const incidentWithAi = {
    ...mockIncidents[0],
    aiAnalysis: {
      facts: ['主軸過熱'],
      possibleCauses: ['冷卻液不足'],
      aiInference: '冷卻循環閥堵塞',
      risks: ['馬達燒毀'],
      priorityReason: '影響 CNC 產能',
      solutionRecommendations: ['執行輔助水冷管路旁通並更換濾網'],
      adopted: false,
    },
  };
  const updated = adoptAiRecommendation([incidentWithAi], '1', '執行輔助水冷管路旁通');
  assert.equal(updated[0].aiAnalysis?.adopted, true);
  assert.ok(updated[0].currentAction.includes('執行輔助水冷管路旁通'));
});

test('generateAiRecord generates structured summary', () => {
  const record = generateAiRecord(mockIncidents[0], '王廠長');
  assert.ok(record.summary.includes('CNC-03 主軸溫度過高'));
  assert.ok(record.confirmedBy, '王廠長');
  assert.ok(record.content.includes('事件基本資訊'));
});
