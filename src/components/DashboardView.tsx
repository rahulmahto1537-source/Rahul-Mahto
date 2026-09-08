import React, { useState } from 'react';
import { Project, Milestone, NavTab } from '../types.ts';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  Radio,
  FileText,
  Sliders,
  Calendar,
  Flag,
  RotateCw,
  Plus,
  Compass,
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  milestones: Milestone[];
  setActiveTab: (tab: NavTab) => void;
  onOpenQuickLog: () => void;
  onFlagDelay: () => void;
  onSimulateSchedule: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  milestones,
  setActiveTab,
  onOpenQuickLog,
  onFlagDelay,
  onSimulateSchedule,
}) => {
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showPdfExportToast, setShowPdfExportToast] = useState(false);

  const handleDownloadPdf = () => {
    setShowPdfExportToast(true);
    setTimeout(() => setShowPdfExportToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 pb-12">
      {/* Role-based Status Ribbon */}
      <div className="bg-[#dce9ff]/60 border border-[#b2c8ed]/40 text-[#0b1c30] flex items-center justify-between px-3 py-1.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#216293]" />
          <span className="font-mono text-[11px] font-bold text-[#0b1c30] truncate tracking-wide uppercase">
            Manager View • Full Edit Access Enabled
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#216293] bg-white px-2 py-0.5 rounded shadow-2xs font-bold shrink-0">
          ENV: PROD
        </span>
      </div>

      {/* Active Project Selector & Meta Section */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Compass className="w-4 h-4 text-[#216293]" />
            <span className="font-mono text-[11px] font-bold uppercase text-[#44474d] tracking-wider truncate">
              Active Workspace Pipeline
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-[#eff4ff] px-2 py-0.5 rounded-full border border-[#d3e4fe]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#216293] animate-ping" />
            <span className="font-mono text-[11px] text-[#216293] font-medium">Sync: Live</span>
          </div>
        </div>

        {/* Project Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowProjectPicker(!showProjectPicker)}
            className="flex items-center justify-between w-full bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors rounded-lg p-3 text-left group border border-[#d3e4fe]/60"
            type="button"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-bold text-[15px] text-[#0b1c30] truncate group-hover:text-[#216293] transition-colors">
                {activeProject.name}
              </span>
              <span className="font-mono text-[11px] text-[#44474d] mt-0.5">
                ID: {activeProject.code} • {activeProject.sector}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-[#44474d] group-hover:text-[#216293]">
              <span className="text-xs font-semibold hidden sm:inline">Switch</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Project Picker Dropdown */}
          {showProjectPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#c4c6ce]/50 p-2 z-30 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] font-bold uppercase text-[#74777e] px-3 py-1 font-mono">
                Select Active Pipeline ({projects.length})
              </div>
              <div className="space-y-1 mt-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      setShowProjectPicker(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                      p.id === activeProject.id ? 'bg-[#eff4ff] border border-[#216293]/30' : 'hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#0b1c30] truncate">{p.name}</div>
                      <div className="font-mono text-[10px] text-[#44474d]">
                        {p.code} • {p.sprint} • {p.healthPercentage}% Health
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        p.status === 'On Track'
                          ? 'bg-[#ecfdf5] text-[#047857]'
                          : p.status === 'Delayed'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#fffbeb] text-[#b45309]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Sub-bar */}
        <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#e5eeff] text-[#025283] rounded font-mono text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#216293]" />
              {activeProject.status} • {activeProject.sprint}
            </span>
            <span className="font-mono text-[11px] text-[#44474d]">
              Velocity: <strong className="text-[#0b1c30]">{activeProject.velocity} pts</strong>
            </span>
          </div>
          <button
            onClick={() => setShowProjectPicker(true)}
            className="flex items-center gap-0.5 text-[#216293] text-xs font-semibold hover:underline"
          >
            <span>All Projects ({projects.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2x2 Metric Summary Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Total Projects */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase text-[#44474d] tracking-wider">Active Load</span>
            <Layers className="w-4 h-4 text-[#216293]" />
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-bold text-[#0b1c30] block">
              {activeProject.activeLoad} Active
            </span>
            <div className="flex items-center gap-1 mt-1 text-[#025283] text-[11px] font-mono">
              <TrendingUp className="w-3 h-3 text-[#216293]" />
              <span>+2 this quarter</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ongoing Tasks with Mini Circular Progress */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase text-[#44474d] tracking-wider">Ongoing Tasks</span>
            {/* Circular dial (68%) */}
            <div className="relative w-6 h-6 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#d3e4fe]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#216293]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="68, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-bold text-[#0b1c30] block">
              {activeProject.ongoingTasks} Tasks
            </span>
            <span className="font-mono text-[11px] text-[#216293] font-semibold block mt-1">
              68% in progress
            </span>
          </div>
        </div>

        {/* Card 3: Completed Milestones */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase text-[#44474d] tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#216293]" />
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-bold text-[#0b1c30] block">
              {activeProject.completedMilestones} Done
            </span>
            <span className="font-mono text-[11px] text-[#44474d] block mt-1">
              94% on-schedule
            </span>
          </div>
        </div>

        {/* Card 4: Critical Delays Alert */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase text-[#ba1a1a] tracking-wider">Risk Radar</span>
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <div className="mt-3">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
              {activeProject.criticalRisks} Critical
            </div>
            <span className="font-mono text-[11px] text-[#ba1a1a] block mt-1 truncate font-medium">
              Interference flagged
            </span>
          </div>
        </div>
      </section>

      {/* Progress Percentage Indicator & Milestone Pacing */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex flex-col gap-3">
        {/* Section Top */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[15px] text-[#0b1c30]">Timeline Health & Cadence</span>
            <span className="font-mono text-2xl font-bold text-[#216293]">
              {activeProject.healthPercentage}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[#44474d] text-xs">
            <span>Target Completion: {activeProject.targetCompletion}</span>
            <span className="font-mono text-[11px] font-semibold text-[#025283] bg-[#e5eeff] px-2 py-0.5 rounded">
              {activeProject.daysDelta}
            </span>
          </div>
        </div>

        {/* Continuous Linear Progress Track */}
        <div className="w-full bg-[#e5eeff] rounded-full h-2.5 overflow-hidden flex">
          <div
            className="bg-[#216293] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${activeProject.healthPercentage}%` }}
          />
        </div>

        {/* Milestone Step Indicator Sequence */}
        <div className="pt-2">
          <span className="font-mono text-[11px] font-bold uppercase text-[#44474d] block mb-2 tracking-wider">
            Milestone Pacing Status
          </span>
          <div className="space-y-1.5">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  m.status === 'Completed'
                    ? 'bg-[#eff4ff]'
                    : m.status === 'Active'
                    ? 'bg-[#e5eeff] border border-[#216293]/30 shadow-xs'
                    : 'bg-[#eff4ff]/60 opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {m.status === 'Completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#216293] shrink-0" />
                  ) : m.status === 'Active' ? (
                    <RotateCw className="w-4 h-4 text-[#216293] animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-[#74777e] inline-block shrink-0" />
                  )}
                  <span
                    className={`text-xs truncate ${
                      m.status === 'Active' ? 'font-bold text-[#0b1c30]' : 'font-medium text-[#44474d]'
                    }`}
                  >
                    {m.step}. {m.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {m.status === 'Active' ? (
                    <span className="font-mono text-[11px] text-[#216293] font-bold">
                      Active ({m.progressPercentage}%)
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#74777e] bg-white px-2 py-0.5 rounded shadow-2xs font-medium">
                      {m.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Quick Actions (Horizontal Ribbon) */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase text-[#44474d] tracking-wider">
            Operational Quick Actions
          </span>
          <span className="font-mono text-[11px] text-[#216293] font-semibold">4 Tools Available</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Action 1: Gantt View */}
          <button
            onClick={() => setActiveTab('timeline')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0f2744] text-white hover:bg-[#216293] rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-98"
          >
            <Sliders className="w-3.5 h-3.5 text-[#89ceff]" />
            <span>Open Gantt</span>
          </button>

          {/* Action 2: Daily Log */}
          <button
            onClick={onOpenQuickLog}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-lg text-xs font-semibold border border-[#d3e4fe] shadow-2xs transition-all active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-[#216293]" />
            <span>Daily Update</span>
          </button>

          {/* Action 3: Flag Delay */}
          <button
            onClick={onFlagDelay}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#93000a] rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-98"
          >
            <Flag className="w-3.5 h-3.5 text-[#ba1a1a]" />
            <span>Flag Delay</span>
          </button>

          {/* Action 4: Weekly Report */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-lg text-xs font-semibold border border-[#d3e4fe] shadow-2xs transition-all active:scale-98"
          >
            <FileText className="w-3.5 h-3.5 text-[#44474d]" />
            <span>Weekly PDF</span>
          </button>
        </div>

        {showPdfExportToast && (
          <div className="p-2 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-[#047857] text-xs font-mono flex items-center justify-between">
            <span>Generating compiled Master Schedule PDF report...</span>
            <span className="font-bold">Ready</span>
          </div>
        )}
      </section>

      {/* Site Context Photo Visual Banner */}
      <section className="relative rounded-xl overflow-hidden bg-[#0f2744] shadow-sm border border-[#c4c6ce]/30">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ-9hDnVlOzI-3yyuyY0NHZLYNCHyl7XJAKXHVDiz0jMXUvgnWu8WBC1o_4Eiq8Kfv_oS-9UYZU3xKecgU99bdK7-MnfvNLFGiwoefIu49cmySHG6kcpa8dbXkwUD3roSpSrdoFrAhnEZ9YsJQJhDT7n1CgmqSaaRB_HoHwJfJluz-3dQBMGv-9wd383DCyzRBrH0mYVaz__BPYmFtPIdUj1LYDw6gMZVTd29a9kKnucEoMihuepWrQ"
          alt="High-angle construction aerial photography of modern suspension bridge deck"
          className="w-full h-36 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2744] via-[#0f2744]/40 to-transparent flex flex-col justify-end p-3.5">
          <div className="flex items-center gap-1.5 text-[#d4e3ff] mb-0.5">
            <Radio className="w-3.5 h-3.5 text-[#89ceff] animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
              Telemetry Camera 04 • Active Deck
            </span>
          </div>
          <div className="flex items-center justify-between text-white">
            <span className="font-bold text-[14px] truncate">Pylon Core 4B Structural Framing</span>
            <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-md font-semibold">
              LIVE 30 FPS
            </span>
          </div>
        </div>
      </section>

      {/* Upcoming Critical Deadlines (Next 7 Days) */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#ba1a1a]" />
            <span className="font-mono text-[11px] font-bold uppercase text-[#0b1c30] tracking-wider">
              Upcoming Critical Deadlines (Next 7 Days)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#44474d] font-semibold">2 Pending</span>
        </div>

        <div className="space-y-2">
          {/* Task Card 1 */}
          <div className="bg-[#eff4ff]/60 border border-[#d3e4fe]/70 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="font-bold text-sm text-[#0b1c30] block truncate">
                  Pour Concrete Sector 4B
                </span>
                <span className="font-mono text-[11px] text-[#44474d]">
                  Spec: High-Yield Hydro-Cure Mix 09
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-mono text-[10px] font-bold shrink-0">
                High Priority
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 bg-white p-2 rounded-lg border border-[#c4c6ce]/20">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1JNFBb0ZztNdIih9s2tuOAXHZWHvS3RmX-l7mgmPmeY3jLPszSPJfr4q3OYx50GWqpmRpDSUAoIaHa2WDLhsnJQ0xbovX62wUVMK7Z9-287OXS-I95Jx8qSX2jCwCKO194TftKFdUJoeg45tWHm4RBRU4yiG1Gya_IuCAoD_ffR-049ZQGktg-C2WNgCKRgg8z_WCGIEk3OYyQ7ZudB-rAK9rxIoWzv0_e1BqTsF2NdDj9v2sBL3E8w"
                  alt="Marcus Chen"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[#0b1c30] truncate">Marcus Chen</div>
                  <div className="font-mono text-[10px] text-[#74777e]">Lead Site Engineer</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#ba1a1a] font-mono text-[11px] font-bold shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>Due Tomorrow, 07:00</span>
              </div>
            </div>
          </div>

          {/* Task Card 2 */}
          <div className="bg-[#eff4ff]/60 border border-[#d3e4fe]/70 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="font-bold text-sm text-[#0b1c30] block truncate">
                  HVAC Duct Inspection & Air Balancing
                </span>
                <span className="font-mono text-[11px] text-[#44474d]">
                  Tunnel Section B-12 Pressure Relief
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[#216293] font-mono text-[10px] font-bold shrink-0">
                Compliance
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ffdad6]/70 text-[#ba1a1a] text-xs font-mono font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Weather Delay risk 1d (Forecast: Heavy Rain)</span>
            </div>

            <div className="flex items-center justify-between pt-1 bg-white p-2 rounded-lg border border-[#c4c6ce]/20">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuARayxD5sTJDXthFtrBgWmIMZxnb1TIw3oQRZlIx2_30_pGecgsfliqwuiaWwDnwUhjWItdepHTVg6tDah2wK_zVEYsfy3ysdXmyWKI3jo7Tjn7dfZ-PRuyS7B5RaUPC00CLiH3yxfejTr1a3efXZCo6Wm05AY9E1sWfQguKAsBR9ZK3VkVuyurmco9DvbWZETe2a1dSA7EefobUolVvcTYc-Md0mXdyii8QOzT7cXyoxcTJdN9afnqSw"
                  alt="Sarah Jenkins"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[#0b1c30] truncate">Sarah Jenkins</div>
                  <div className="font-mono text-[10px] text-[#74777e]">MEP Compliance Lead</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#44474d] font-mono text-[11px] font-semibold shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Friday, 16:30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Project Switcher Modal Simulation / Quick Help */}
      <section className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#d3e4fe] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#216293] shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-[#0b1c30] truncate">Need schedule adjustments?</div>
            <div className="text-[11px] text-[#44474d] truncate">Simulate critical path recalculation</div>
          </div>
        </div>
        <button
          onClick={onSimulateSchedule}
          className="px-3 py-1.5 bg-white hover:bg-[#dce9ff] text-[#0b1c30] rounded-lg font-mono text-xs font-bold border border-[#c4c6ce]/40 shadow-xs shrink-0 transition-colors"
        >
          Simulate
        </button>
      </section>
    </div>
  );
};
