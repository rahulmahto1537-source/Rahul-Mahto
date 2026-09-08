import React, { useState, useRef } from 'react';
import { GanttTask } from '../types.ts';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Sliders,
  Phone,
  MessageSquare,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  Lock,
  GitBranch,
} from 'lucide-react';

interface TimelineViewProps {
  tasks: GanttTask[];
  onUpdateTask: (id: string, updates: Partial<GanttTask>) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onUpdateTask }) => {
  const [scope, setScope] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [filter, setFilter] = useState<'all' | 'critical' | 'delayed' | 'mine'>('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('t3');
  const [dateRange, setDateRange] = useState('Oct 14 – Oct 28, 2025');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [auditLogOpen, setAuditLogOpen] = useState(false);
  const [callToast, setCallToast] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'critical') return t.isCriticalPath;
    if (filter === 'delayed') return t.delayDays > 0;
    if (filter === 'mine') return t.assignee.name.includes('Chen') || t.assignee.name.includes('Elena');
    return true;
  });

  const jumpToToday = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 240, behavior: 'smooth' });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = parseInt(e.target.value, 10);
    const baseDays = 4;
    const newDelay = Math.max(0, newTotal - baseDays);
    onUpdateTask(selectedTask.id, {
      durationDays: newTotal,
      delayDays: newDelay,
    });
  };

  const handleConfirmAdjustment = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  const daysList = [
    { day: '14 M', num: 14, isToday: false, isWeekend: false },
    { day: '15 T', num: 15, isToday: false, isWeekend: false },
    { day: '16 W', num: 16, isToday: false, isWeekend: false },
    { day: '17 T', num: 17, isToday: false, isWeekend: false },
    { day: '18 F', num: 18, isToday: false, isWeekend: false },
    { day: '19 S', num: 19, isToday: false, isWeekend: true },
    { day: '20 S', num: 20, isToday: false, isWeekend: true },
    { day: '21 M', num: 21, isToday: true, isWeekend: false },
    { day: '22 T', num: 22, isToday: false, isWeekend: false },
    { day: '23 W', num: 23, isToday: false, isWeekend: false },
    { day: '24 T', num: 24, isToday: false, isWeekend: false },
    { day: '25 F', num: 25, isToday: false, isWeekend: false },
    { day: '26 S', num: 26, isToday: false, isWeekend: true },
    { day: '27 S', num: 27, isToday: false, isWeekend: true },
    { day: '28 M', num: 28, isToday: false, isWeekend: false },
  ];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4 pb-12">
      {/* Interactive Top Control Deck */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex flex-col gap-3">
        {/* Scope Selector Segmented Control */}
        <div className="flex items-center justify-between gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#d3e4fe]/50">
          {(['day', 'week', 'month', 'quarter'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`flex-1 py-1.5 px-2 text-center rounded-lg font-mono text-[11px] font-bold uppercase transition-all ${
                scope === s
                  ? 'bg-[#0f2744] text-white shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Date Navigator & Jump to Today */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDateRange('Oct 07 – Oct 21, 2025')}
              className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center transition-colors border border-[#d3e4fe]"
              aria-label="Previous date range"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              <Calendar className="w-4 h-4 text-[#216293]" />
              <span className="font-mono text-xs font-semibold text-[#0b1c30] tracking-tight">
                {dateRange}
              </span>
            </div>
            <button
              onClick={() => setDateRange('Oct 21 – Nov 04, 2025')}
              className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center transition-colors border border-[#d3e4fe]"
              aria-label="Next date range"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={jumpToToday}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#e5eeff] text-[#025283] hover:bg-[#d3e4fe] transition-colors rounded-lg font-mono text-[11px] font-bold uppercase tracking-wider"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === 'all'
                ? 'bg-[#0f2744] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#e5eeff]'
            }`}
          >
            <span>All Tasks ({tasks.length})</span>
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === 'critical'
                ? 'bg-[#0f2744] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#e5eeff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
            <span>Critical Path (3)</span>
          </button>
          <button
            onClick={() => setFilter('delayed')}
            className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === 'delayed'
                ? 'bg-[#0f2744] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#e5eeff]'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-[#ba1a1a]" />
            <span>Delayed Only (1)</span>
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === 'mine'
                ? 'bg-[#0f2744] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#e5eeff]'
            }`}
          >
            <span>My Assignments</span>
          </button>
        </div>
      </div>

      {/* Timeline Live Status Strip */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#e5eeff] rounded-xl border border-[#d3e4fe] text-[#44474d] font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#216293] animate-pulse" />
          <span className="font-bold text-[#0b1c30]">Sprint Phase 04 / Core Erection</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Baseline: <strong className="text-[#0b1c30]">88% Aligned</strong></span>
          <span className="text-[#ba1a1a] font-bold">+3d Slip</span>
        </div>
      </div>

      {/* Dual-Pane Gantt Workspace */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c4c6ce]/40 overflow-hidden flex flex-col">
        <div className="flex w-full overflow-hidden">
          {/* Sticky Left Pane: Work Breakdown */}
          <div className="w-[38%] min-w-[136px] max-w-[170px] shrink-0 bg-white border-r border-[#c4c6ce]/30 flex flex-col z-20 shadow-xs">
            <div className="h-10 px-2.5 flex items-center justify-between bg-[#eff4ff] border-b border-[#c4c6ce]/30">
              <span className="font-mono text-[10px] font-bold uppercase text-[#44474d] tracking-wider">
                Work Breakdown
              </span>
            </div>

            {/* Task Row Headers */}
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className={`h-20 px-2.5 py-2 flex flex-col justify-center cursor-pointer border-b border-[#eff4ff] transition-colors relative ${
                  t.id === selectedTaskId
                    ? 'bg-[#dce9ff]/70 border-l-4 border-l-[#ba1a1a]'
                    : 'hover:bg-[#f8f9ff]'
                }`}
              >
                <div className="flex items-center gap-1 text-[#0b1c30]">
                  {t.status === 'Complete' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#216293] shrink-0" />
                  ) : t.status === 'Delayed' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-[#216293] shrink-0" />
                  )}
                  <span className="font-bold text-xs truncate">{t.name}</span>
                </div>
                <span className="text-[10px] text-[#44474d] truncate mt-0.5">{t.subtitle}</span>
                <span
                  className={`font-mono text-[9px] font-semibold mt-1 ${
                    t.status === 'Delayed' ? 'text-[#ba1a1a]' : 'text-[#216293]'
                  }`}
                >
                  {t.status === 'Complete'
                    ? '100% Complete'
                    : t.status === 'Delayed'
                    ? `Delayed (+${t.delayDays}d)`
                    : `${t.progress}% · Active`}
                </span>
              </div>
            ))}
          </div>

          {/* Right Scrollable Gantt Bar Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto relative no-scrollbar select-none bg-[#f8f9ff]"
          >
            <div className="w-[720px] relative">
              {/* Calendar Days Header */}
              <div className="h-10 flex items-center bg-[#eff4ff] border-b border-[#c4c6ce]/30 font-mono text-[11px] text-[#44474d]">
                {daysList.map((d, i) => (
                  <div
                    key={i}
                    className={`w-12 text-center shrink-0 ${
                      d.isToday
                        ? 'bg-[#8ec6fd]/40 text-[#025283] font-bold rounded'
                        : d.isWeekend
                        ? 'text-[#74777e]/60'
                        : ''
                    }`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>

              {/* Vertical Grid Columns */}
              <div className="absolute inset-0 top-10 flex pointer-events-none z-0">
                {daysList.map((d, i) => (
                  <div
                    key={i}
                    className={`w-12 h-full border-r border-[#e5eeff] shrink-0 ${
                      d.isToday ? 'bg-[#216293]/10 relative' : d.isWeekend ? 'bg-[#dce9ff]/20' : ''
                    }`}
                  >
                    {d.isToday && (
                      <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[#216293] z-10" />
                    )}
                  </div>
                ))}
              </div>

              {/* Dependency Connector SVGs */}
              <svg className="absolute inset-0 top-10 w-full h-[320px] pointer-events-none z-10">
                {/* Connector from Task 2 to Task 3 */}
                <path
                  d="M 440 120 L 460 120 L 460 180 L 390 180 L 390 200 L 396 200"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeDasharray="3,3"
                  strokeWidth="2"
                />
                <polygon fill="#ba1a1a" points="396,196 404,200 396,204" />
                {/* Connector from Task 3 to Task 4 */}
                <path
                  d="M 580 200 L 600 200 L 600 260 L 540 260"
                  fill="none"
                  stroke="#216293"
                  strokeWidth="1.5"
                />
                <polygon fill="#216293" points="544,256 536,260 544,264" />
              </svg>

              {/* Timeline Track Rows */}
              <div className="relative z-10">
                {/* Row 1: Foundation Works */}
                <div className="h-20 relative flex items-center border-b border-[#eff4ff]">
                  <div
                    onClick={() => setSelectedTaskId('t1')}
                    className="absolute left-2 w-[220px] h-9 rounded-lg bg-[#0f2744] text-white shadow-xs flex items-center justify-between px-2.5 cursor-pointer hover:ring-2 hover:ring-[#216293]"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#89ceff]" />
                      <span className="font-mono text-[11px] font-semibold truncate">
                        Piling Complete
                      </span>
                    </div>
                    <span className="font-mono text-[10px] bg-[#021c39] px-1.5 py-0.5 rounded text-[#d4e3ff]">
                      5d
                    </span>
                  </div>
                  {/* Milestone diamond at end of Foundation */}
                  <div
                    className="absolute left-[222px] top-[34px] w-3 h-3 rotate-45 bg-[#0f2744] shadow-xs"
                    title="Foundation Gate MS"
                  />
                </div>

                {/* Row 2: Steel Framework Assembly */}
                <div className="h-20 relative flex items-center border-b border-[#eff4ff] bg-[#eff4ff]/30">
                  <div
                    onClick={() => setSelectedTaskId('t2')}
                    className="absolute left-[144px] w-[310px] h-10 rounded-lg bg-[#d3e4fe] shadow-xs flex items-center overflow-hidden cursor-pointer group hover:ring-2 hover:ring-[#216293]"
                  >
                    {/* 70% Progress Fill */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#216293] to-[#8ec6fd] rounded-l-lg flex items-center px-2.5"
                      style={{ width: '70%' }}
                    >
                      <span className="font-mono text-[11px] text-white font-bold truncate">
                        Steel Frame Assembly (70%)
                      </span>
                    </div>
                    {/* Assignee Badge */}
                    <div className="absolute right-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO_2I8kTW17MPZwWoeor_jrvc5CNh7kdAPad_A9-v3uAHSE9Qid_QUfACP-A7ul-GdEXa_Wc7BfD3mAIKOXeSTv534bZ2U8ibVtl4D2llm_xi_YI8r1_p6DUCJA72lF4ziXl2O_lqE7R7jvPFBw4PrGU_DpXivLaJCjqUbZn6gEmE9XN4JuAijXC0p2xw77GHcfNARud2LCagR_tOXyMQqDQWtC2M0zTPbTVf29tby3YpfRCroF-eTsg"
                        alt=""
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="font-mono text-[10px] text-[#0b1c30] font-medium">Alex V.</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Reinforced Decking (Delayed) */}
                <div className="h-20 relative flex items-center border-b border-[#eff4ff] bg-[#dce9ff]/20">
                  <div
                    onClick={() => setSelectedTaskId('t3')}
                    className={`absolute left-[384px] h-11 rounded-lg bg-white shadow-md flex items-center relative ring-2 cursor-pointer transition-all ${
                      selectedTaskId === 't3' ? 'ring-[#ba1a1a]' : 'ring-[#ba1a1a]/40'
                    }`}
                    style={{ width: `${selectedTask.id === 't3' ? selectedTask.durationDays * 44 : 290}px` }}
                  >
                    {/* 25% progress */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#216293] rounded-l-lg"
                      style={{ width: '25%' }}
                    />
                    <div className="relative z-10 px-2 flex items-center justify-between w-[160px]">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[11px] text-[#0b1c30] truncate">
                          Decking Pour B
                        </span>
                        <span className="font-mono text-[9px] text-[#ba1a1a] font-bold">
                          {selectedTask.id === 't3' ? selectedTask.progress : 25}% Progress
                        </span>
                      </div>
                    </div>
                    {/* Striped delayed tail */}
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#ba1a1a]/15 rounded-r-lg flex items-center justify-center px-1 overflow-hidden"
                      style={{
                        width: `${Math.max(40, (selectedTask.delayDays || 3) * 30)}px`,
                        backgroundImage:
                          'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(186, 26, 26, 0.15) 6px, rgba(186, 26, 26, 0.15) 12px)',
                      }}
                    >
                      <span className="font-mono text-[9px] font-bold text-[#ba1a1a] text-center leading-tight">
                        +{selectedTask.delayDays}d Slip
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 4: Structural Signoff Gate */}
                <div className="h-16 relative flex items-center">
                  <div
                    onClick={() => setSelectedTaskId('t4')}
                    className="absolute left-[528px] flex items-center gap-2 cursor-pointer"
                  >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#0f2744]/20 rounded-full animate-ping" />
                      <div className="w-3.5 h-3.5 rotate-45 bg-[#0f2744] shadow-sm" />
                    </div>
                    <span className="bg-[#0f2744] text-white px-2 py-0.5 rounded font-mono text-[10px] font-semibold shadow-2xs whitespace-nowrap">
                      Structural Signoff Gate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#eff4ff] border-t border-[#c4c6ce]/30 font-mono text-[11px] text-[#44474d]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0f2744]" /> Complete
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#216293]" /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#ffdad6] border border-[#ba1a1a]" /> Delay Slip
            </span>
          </div>
          <span className="text-[#216293] font-semibold">Swipe/scroll for full range →</span>
        </div>
      </div>

      {/* Selected Task Panel & Reschedule Adjuster */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c4c6ce]/30 p-4 flex flex-col gap-4">
        {/* Header Slot */}
        <div className="flex items-start justify-between pb-3 border-b border-[#eff4ff]">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
              <span className="font-mono text-[10px] uppercase text-[#ba1a1a] font-bold tracking-wider">
                {selectedTask.isCriticalPath ? 'Critical Path Item' : 'Scheduled Work Package'}
              </span>
            </div>
            <h2 className="font-bold text-base text-[#0b1c30] mt-0.5 truncate">
              {selectedTask.name}
            </h2>
            <span className="font-mono text-[11px] text-[#44474d]">
              Task ID: {selectedTask.wbsId} · {selectedTask.subtitle}
            </span>
          </div>
          <span
            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
              selectedTask.status === 'Delayed'
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : 'bg-[#e5eeff] text-[#216293]'
            }`}
          >
            {selectedTask.status}
          </span>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col">
            <span className="font-mono text-[10px] text-[#44474d] uppercase font-bold">
              Total Duration
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-2xl font-bold text-[#0b1c30]">
                {selectedTask.durationDays}
              </span>
              <span className="text-xs text-[#44474d]">Days</span>
              {selectedTask.delayDays > 0 && (
                <span className="font-mono text-[11px] text-[#ba1a1a] font-semibold ml-auto">
                  (4d base + {selectedTask.delayDays}d slip)
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col">
            <span className="font-mono text-[10px] text-[#44474d] uppercase font-bold">
              Start Date
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-bold text-[#0b1c30]">
                {selectedTask.startDateFormatted}
              </span>
              <Calendar className="w-4 h-4 text-[#216293]" />
            </div>
          </div>
        </div>

        {/* Duration Slider Micro-Interaction */}
        <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-xs text-[#0b1c30]">
              Adjust Duration Window & Buffer
            </label>
            <span className="font-mono text-xs text-[#216293] font-bold">
              {selectedTask.durationDays} Days Window
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={14}
            value={selectedTask.durationDays}
            onChange={handleSliderChange}
            className="w-full h-2 bg-[#d3e4fe] rounded-lg appearance-none cursor-pointer accent-[#216293]"
          />
          <div className="flex justify-between font-mono text-[9px] text-[#74777e]">
            <span>Min 3 Days</span>
            <span>Target Base: 4 Days</span>
            <span>Max 14 Days</span>
          </div>
        </div>

        {/* Upstream Dependency */}
        {selectedTask.upstreamDependency && (
          <div className="p-3 bg-[#eff4ff] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <GitBranch className="w-4 h-4 text-[#216293] shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-xs text-[#0b1c30] truncate">
                  {selectedTask.upstreamDependency.name}
                </div>
                <div className="font-mono text-[10px] text-[#44474d]">
                  {selectedTask.upstreamDependency.type}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dce9ff] text-[#025283] rounded font-mono text-[10px] font-bold uppercase">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          </div>
        )}

        {/* Assignee Contact Card */}
        <div className="p-3 bg-[#eff4ff] rounded-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={selectedTask.assignee.avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#c4c6ce]"
            />
            <div className="min-w-0">
              <div className="font-bold text-xs text-[#0b1c30] truncate">
                {selectedTask.assignee.name}
              </div>
              <div className="text-[11px] text-[#44474d] truncate">
                {selectedTask.assignee.role}
              </div>
              <div className="font-mono text-[10px] text-[#216293] font-semibold">
                {selectedTask.assignee.channel}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setCallToast(`Calling ${selectedTask.assignee.name} via ${selectedTask.assignee.channel}...`);
                setTimeout(() => setCallToast(null), 3000);
              }}
              className="w-8 h-8 rounded-lg bg-white text-[#216293] hover:bg-[#216293] hover:text-white flex items-center justify-center transition-colors shadow-2xs border border-[#d3e4fe]"
              title="Call Site Radio"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCallToast(`Connecting tactical messenger to ${selectedTask.assignee.name}`);
                setTimeout(() => setCallToast(null), 3000);
              }}
              className="w-8 h-8 rounded-lg bg-white text-[#216293] hover:bg-[#216293] hover:text-white flex items-center justify-center transition-colors shadow-2xs border border-[#d3e4fe]"
              title="Send Direct Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Call Toast */}
        {callToast && (
          <div className="p-2 bg-[#0f2744] text-white rounded-lg text-xs font-mono flex items-center justify-between">
            <span>{callToast}</span>
            <button onClick={() => setCallToast(null)} className="text-white/70 hover:text-white ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Active Mitigation Log */}
        {selectedTask.mitigationLog && (
          <div className="p-3 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-[#ba1a1a]">Active Mitigation Log</span>
              <p className="text-xs text-[#0b1c30] mt-0.5 leading-relaxed">
                {selectedTask.mitigationLog.text}
              </p>
              <span className="font-mono text-[10px] text-[#74777e] mt-1">
                {selectedTask.mitigationLog.loggedAt}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleConfirmAdjustment}
            className={`flex-1 h-10 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
              saveSuccess
                ? 'bg-[#047857] text-white'
                : 'bg-[#0f2744] text-white hover:bg-[#216293]'
            }`}
          >
            <Check className="w-4 h-4" />
            {saveSuccess ? 'Adjustment Saved to Master Gantt!' : 'Confirm Adjustment'}
          </button>
          <button
            onClick={() => setAuditLogOpen(!auditLogOpen)}
            className="px-4 h-10 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-semibold text-xs border border-[#d3e4fe] flex items-center gap-1.5 transition-colors"
          >
            <History className="w-4 h-4 text-[#44474d]" />
            Audit Log
          </button>
        </div>

        {/* Audit Log Flyout */}
        {auditLogOpen && (
          <div className="p-3 bg-[#eff4ff] border border-[#d3e4fe] rounded-lg text-xs font-mono space-y-2">
            <div className="font-bold text-[#0b1c30]">Recent Timeline Adjustments</div>
            <div className="text-[11px] text-[#44474d] border-b border-[#d3e4fe] pb-1">
              [2025-10-21 08:30] Duration revised from 4d to 7d (+3d slip logged) by Elena Rostova
            </div>
            <div className="text-[11px] text-[#44474d]">
              [2025-10-18 16:15] Steel Frame assembly milestone marked 70% completed by Alex V.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
