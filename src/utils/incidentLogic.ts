import { Incident, IncidentSummaryStats, IncidentStatus, Assignee, AiGeneratedRecord } from '../types/incident';

/**
 * Calculate dashboard summary statistics from incident list
 */
export function calculateSummaryStats(incidents: Incident[]): IncidentSummaryStats {
  const stats: IncidentSummaryStats = {
    total: incidents.length,
    inProgress: 0,
    awaitingManager: 0,
    completed: 0,
    overdue: 0,
    criticalCount: 0,
  };

  for (const inc of incidents) {
    if (inc.status === 'in_progress') stats.inProgress++;
    if (inc.status === 'awaiting_manager' || inc.requiresManagerDecision) stats.awaitingManager++;
    if (inc.status === 'completed') stats.completed++;
    if (inc.status === 'overdue') stats.overdue++;
    if (inc.priority === 'critical' || inc.priority === 'high') stats.criticalCount++;
  }

  return stats;
}

/**
 * Format elapsed minutes into a friendly string
 */
export function formatElapsedTime(minutes: number): string {
  if (minutes < 1) return '剛發生';
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `${hours} 小時前`;
  return `${hours} 小時 ${remainingMins} 分前`;
}

/**
 * Filter and sort incident list
 */
export function filterAndSortIncidents(
  incidents: Incident[],
  filters: {
    search?: string;
    status?: string;
    line?: string;
    category?: string;
    priority?: string;
    sortBy?: 'time' | 'priority' | 'status';
  }
): Incident[] {
  return incidents
    .filter((inc) => {
      // Search term
      if (filters.search && filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        const matchTitle = inc.title.toLowerCase().includes(query);
        const matchCode = inc.code.toLowerCase().includes(query);
        const matchLine = inc.line.toLowerCase().includes(query);
        const matchAssignee = inc.assignee?.name.toLowerCase().includes(query) ?? false;
        const matchDesc = inc.description.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchLine && !matchAssignee && !matchDesc) {
          return false;
        }
      }

      // Status
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'awaiting_decision') {
          if (!inc.requiresManagerDecision && inc.status !== 'awaiting_manager') return false;
        } else if (inc.status !== filters.status) {
          return false;
        }
      }

      // Line
      if (filters.line && filters.line !== 'all') {
        if (!inc.line.toLowerCase().includes(filters.line.toLowerCase())) return false;
      }

      // Category
      if (filters.category && filters.category !== 'all') {
        if (inc.category !== filters.category) return false;
      }

      // Priority
      if (filters.priority && filters.priority !== 'all') {
        if (inc.priority !== filters.priority) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'priority') {
        const weight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      if (filters.sortBy === 'status') {
        const statusOrder: Record<string, number> = {
          awaiting_manager: 5,
          overdue: 4,
          in_progress: 3,
          pending: 2,
          completed: 1,
        };
        return (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0);
      }
      // default: sortBy time / elapsed (most recent or longest pending)
      return b.elapsedMinutes - a.elapsedMinutes;
    });
}

/**
 * Update incident status with logging
 */
export function updateIncidentStatus(
  incidents: Incident[],
  id: string,
  newStatus: IncidentStatus,
  actorName: string = '王廠長',
  note?: string
): Incident[] {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return incidents.map((inc) => {
    if (inc.id !== id) return inc;

    let resultNote = note;
    let nextStep = inc.nextStep;
    let requiresDecision = inc.requiresManagerDecision;
    let progress = inc.progressPercent;

    if (newStatus === 'completed') {
      resultNote = note || '廠長已審查並確認結案，設備與產線復原運轉。';
      nextStep = '結案歸檔，納入當日 AI 廠務總結報告。';
      requiresDecision = false;
      progress = 100;
    } else if (newStatus === 'in_progress') {
      resultNote = note || '廠長指示加速處置，人員持續排除問題中。';
      progress = Math.max(progress, 50);
    } else if (newStatus === 'awaiting_manager') {
      requiresDecision = true;
    }

    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      actor: actorName,
      note: resultNote || `狀態更新為：${getStatusLabel(newStatus)}`,
      type: (actorName.includes('廠長') ? 'manager' : 'system') as 'manager' | 'system',
    };

    return {
      ...inc,
      status: newStatus,
      lastUpdated: timeStr,
      currentResult: resultNote || inc.currentResult,
      nextStep,
      requiresManagerDecision: requiresDecision,
      progressPercent: progress,
      historyLogs: [newLog, ...inc.historyLogs],
    };
  });
}

/**
 * Assign personnel to unassigned incident
 */
export function assignPersonnel(
  incidents: Incident[],
  id: string,
  assignee: Assignee,
  handlingMethod?: string
): Incident[] {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return incidents.map((inc) => {
    if (inc.id !== id) return inc;

    const method = handlingMethod || `由 ${assignee.dept} ${assignee.name} 接手現場處置與日誌補登。`;
    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      actor: '王廠長',
      note: `指派負責人：${assignee.name}（${assignee.dept} / ${assignee.role}）`,
      type: 'manager' as const,
    };

    return {
      ...inc,
      assignee,
      status: 'in_progress',
      handlingMethod: method,
      currentAction: `負責人已抵達現場進行查證`,
      progressPercent: 30,
      lastUpdated: timeStr,
      historyLogs: [newLog, ...inc.historyLogs],
    };
  });
}

/**
 * Adopt AI recommendation
 */
export function adoptAiRecommendation(
  incidents: Incident[],
  id: string,
  actionText: string
): Incident[] {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return incidents.map((inc) => {
    if (inc.id !== id) return inc;

    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      actor: '王廠長 (採納 AI 建議)',
      note: `採納執行決策：「${actionText}」，已自動下達產線班組執行。`,
      type: 'ai' as const,
    };

    return {
      ...inc,
      status: 'in_progress',
      lastUpdated: timeStr,
      currentAction: `已依據 AI 建議執行：${actionText}`,
      progressPercent: Math.min(100, inc.progressPercent + 25),
      aiAnalysis: inc.aiAnalysis
        ? {
            ...inc.aiAnalysis,
            adopted: true,
            adoptedTime: timeStr,
            adoptedAction: actionText,
          }
        : undefined,
      historyLogs: [newLog, ...inc.historyLogs],
    };
  });
}

/**
 * Generate formal AI incident record for archiving
 */
export function generateAiRecord(incident: Incident, confirmedBy: string = '王廠長'): AiGeneratedRecord {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    summary: `【正式結案紀錄】${incident.code} ${incident.title} - 發生於 ${incident.time}，由 ${incident.assignee?.name || '專責人員'} 處置完成，廠長審查通過。`,
    confirmedBy,
    confirmedAt: `${dateStr} ${timeStr}`,
    content: `一、事件基本資訊
- 事件代碼：${incident.code}
- 發生產線：${incident.line}
- 發生時間：${incident.date} ${incident.time} (經過 ${incident.elapsedMinutes} 分鐘)
- 事件來源：${incident.source}
- 異常描述：${incident.description}

二、處置過程與負責人
- 處置人員：${incident.assignee?.name} (${incident.assignee?.dept} / ${incident.assignee?.role})
- 處置方式：${incident.handlingMethod}
- 最終執行作為：${incident.currentAction}
- 現場回報紀錄：${incident.lastReportNote}

三、AI 智慧輔助分析與對策
- 潛在根本原因：${incident.aiAnalysis?.possibleCauses.join('；') || '設備散熱管路短暫阻滯或負荷突波'}
- 風險防範措施：${incident.aiAnalysis?.solutionRecommendations.join('；') || '加強次日交接檢查與熱影像巡檢'}

四、廠長簽核結論
- 審核主管：${confirmedBy}
- 簽核判定：正常復機，無安全疑慮，納入每週保養預警名冊。`,
    keyTakeaways: [
      `現場響應時間：${incident.elapsedMinutes} 分鐘內完成處置`,
      `處置標準化程度：符合 ISO-9001 工廠作業安全準則`,
      `AI 預防性保養建議已自動排入次週保養清單`,
    ],
  };
}

export function getStatusLabel(status: IncidentStatus): string {
  switch (status) {
    case 'pending':
      return '待處理';
    case 'in_progress':
      return '處理中';
    case 'awaiting_manager':
      return '等待確認';
    case 'completed':
      return '已完成';
    case 'overdue':
      return '逾時未解決';
    default:
      return status;
  }
}
