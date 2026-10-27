import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { IncidentPipelineTable } from './components/IncidentPipelineTable';
import { AiAgentWidget } from './components/AiAgentWidget';
import { AiAgentDrawer } from './components/AiAgentDrawer';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { AssignPersonnelModal } from './components/AssignPersonnelModal';
import { AiRecordModal } from './components/AiRecordModal';
import { NewIncidentModal } from './components/NewIncidentModal';
import { OtherTabsView } from './components/OtherTabsView';
import { INITIAL_INCIDENTS } from './data/initialIncidents';
import { Incident, Assignee, IncidentStatus } from './types/incident';
import {
  calculateSummaryStats,
  filterAndSortIncidents,
  updateIncidentStatus,
  assignPersonnel,
  adoptAiRecommendation,
} from './utils/incidentLogic';
import { Check, Info } from 'lucide-react';

export default function App() {
  // State
  const [currentTab, setCurrentTab] = useState<string>('incidents');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lineFilter, setLineFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'status'>('time');

  // Drawer & Modals state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [selectedIncidentForAi, setSelectedIncidentForAi] = useState<Incident | null>(null);
  const [detailModalIncident, setDetailModalIncident] = useState<Incident | null>(null);
  const [assignModalIncident, setAssignModalIncident] = useState<Incident | null>(null);
  const [recordModalIncident, setRecordModalIncident] = useState<Incident | null>(null);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Summary stats
  const summaryStats = calculateSummaryStats(incidents);

  // Filtered incidents
  const filteredIncidents = filterAndSortIncidents(incidents, {
    search: searchQuery,
    status: statusFilter,
    line: lineFilter,
    category: categoryFilter,
    priority: 'all',
    sortBy,
  });

  // Handlers
  const handleOpenAiDrawer = (targetIncident?: Incident) => {
    if (targetIncident) {
      setSelectedIncidentForAi(targetIncident);
    } else if (!selectedIncidentForAi && incidents.length > 0) {
      setSelectedIncidentForAi(incidents[0]);
    }
    setIsAiDrawerOpen(true);
  };

  const handleOpenAiAnalysis = (inc: Incident) => {
    setSelectedIncidentForAi(inc);
    setIsAiDrawerOpen(true);
  };

  const handleAdoptRecommendation = (incidentId: string, recText: string) => {
    const updated = adoptAiRecommendation(incidents, incidentId, recText);
    setIncidents(updated);
    showToast(`已成功採納 AI 建議：「${recText}」，已自動通報產線執行！`);
  };

  const handleUpdateStatus = (id: string, newStatus: IncidentStatus, note?: string) => {
    const updated = updateIncidentStatus(incidents, id, newStatus, '王廠長', note);
    setIncidents(updated);
    showToast(`事件狀態已更新完成，四欄進程與總結數據已同步！`);
  };

  const handleQuickComplete = (inc: Incident) => {
    handleUpdateStatus(inc.id, 'completed', '王廠長已複查處置報告並確認結案。');
  };

  const handleManagerDecision = (inc: Incident) => {
    setDetailModalIncident(inc);
  };

  const handleAssignPersonnel = (incidentId: string, assignee: Assignee, methodNote?: string) => {
    const updated = assignPersonnel(incidents, incidentId, assignee, methodNote);
    setIncidents(updated);
    showToast(`已成功指派【${assignee.name}】（${assignee.dept}）前往現場處置！`);
  };

  const handleConfirmSaveRecord = (incidentId: string, record: any) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, aiGeneratedRecord: record } : i))
    );
    showToast('AI 標準化事件紀錄已由王廠長簽核完畢，正式歸檔於廠長案卷室！');
  };

  const handleAddNewIncident = (newInc: Incident) => {
    setIncidents((prev) => [newInc, ...prev]);
    showToast(`已新增模擬事件【${newInc.code}】，即時加入四大欄位管理流程！`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setLineFilter('all');
    setCategoryFilter('all');
    setSortBy('time');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#15171C] flex">
      {/* 1. Left System Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAiDrawer={() => handleOpenAiDrawer()}
        incidentCount={incidents.filter((i) => i.status !== 'completed').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Toolbar */}
        <Header
          onOpenAiDrawer={() => handleOpenAiDrawer()}
          incidents={incidents}
          onSelectIncident={(inc) => setDetailModalIncident(inc)}
        />

        {/* 3. Central Workspace View */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1720px] w-full mx-auto">
          {currentTab === 'incidents' ? (
            <>
              {/* Summary Cards */}
              <SummaryCards
                stats={summaryStats}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
              />

              {/* Search & Filters Bar */}
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                lineFilter={lineFilter}
                onLineChange={setLineFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onOpenNewIncidentModal={() => setIsNewIncidentModalOpen(true)}
                onResetFilters={handleResetFilters}
                totalFiltered={filteredIncidents.length}
              />

              {/* Core Four-Column Pipeline Table */}
              <IncidentPipelineTable
                incidents={filteredIncidents}
                onSelectIncident={(inc) => setDetailModalIncident(inc)}
                onOpenAiAnalysis={handleOpenAiAnalysis}
                onOpenAssignModal={(inc) => setAssignModalIncident(inc)}
                onQuickComplete={handleQuickComplete}
                onManagerDecision={handleManagerDecision}
              />
            </>
          ) : (
            <OtherTabsView
              currentTab={currentTab}
              onNavigateToIncidents={() => setCurrentTab('incidents')}
              incidents={incidents}
              onOpenAiDrawer={() => handleOpenAiDrawer()}
            />
          )}
        </main>
      </div>

      {/* Floating AI Agent Character (Bot at Bottom-Right) */}
      <AiAgentWidget
        onOpenDrawer={handleOpenAiDrawer}
        incidents={incidents}
        isDrawerOpen={isAiDrawerOpen}
      />

      {/* Slide-out AI Agent Panel */}
      <AiAgentDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        selectedIncident={selectedIncidentForAi}
        allIncidents={incidents}
        onSelectIncidentForAnalysis={(inc) => setSelectedIncidentForAi(inc)}
        onAdoptRecommendation={handleAdoptRecommendation}
        onOpenRecordModal={(inc) => setRecordModalIncident(inc)}
      />

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={detailModalIncident}
        onClose={() => setDetailModalIncident(null)}
        onOpenAiAnalysis={handleOpenAiAnalysis}
        onOpenRecordModal={(inc) => setRecordModalIncident(inc)}
        onOpenAssignModal={(inc) => setAssignModalIncident(inc)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Assign Personnel Modal */}
      <AssignPersonnelModal
        incident={assignModalIncident}
        isOpen={Boolean(assignModalIncident)}
        onClose={() => setAssignModalIncident(null)}
        onAssign={handleAssignPersonnel}
      />

      {/* AI Formal Record Modal */}
      <AiRecordModal
        incident={recordModalIncident}
        isOpen={Boolean(recordModalIncident)}
        onClose={() => setRecordModalIncident(null)}
        onConfirmSave={handleConfirmSaveRecord}
      />

      {/* New Incident Simulation Modal */}
      <NewIncidentModal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
        onAddIncident={handleAddNewIncident}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#15171C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-[13px] font-semibold">
          <div className="w-5 h-5 rounded-full bg-[#C9F65B] text-[#15171C] flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
