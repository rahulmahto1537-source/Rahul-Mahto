import React, { useState } from 'react';
import { Activity, FeedUpdate, DelayAlert } from '../types.ts';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  Paperclip,
  MapPin,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Lock,
  Download,
  Phone,
  Maximize2,
  RefreshCw,
  PlusCircle,
  ChevronRight,
} from 'lucide-react';

interface ActivitiesViewProps {
  activities: Activity[];
  feed: FeedUpdate[];
  alerts: DelayAlert[];
  onAddActivity: (act: Partial<Activity>) => void;
  onPostFeed: (content: string, progress?: number, image?: string) => void;
  onLikeFeed: (id: string) => void;
  onAcknowledgeAlerts: () => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  feed,
  alerts,
  onAddActivity,
  onPostFeed,
  onLikeFeed,
  onAcknowledgeAlerts,
}) => {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'pending' | 'completed'>('all');
  const [quickText, setQuickText] = useState('');
  const [quickPercent, setQuickPercent] = useState('');
  const [showAlertsBanner, setShowAlertsBanner] = useState(true);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [viewPathModalOpen, setViewPathModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newScope, setNewScope] = useState('');
  const [newTeam, setNewTeam] = useState('Civil Ops');
  const [newStatus, setNewStatus] = useState<'ongoing' | 'pending' | 'completed'>('ongoing');
  const [newProgress, setNewProgress] = useState('50');

  const filteredActivities = activities.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    onPostFeed(quickText.trim(), quickPercent ? parseInt(quickPercent, 10) : undefined);
    setQuickText('');
    setQuickPercent('');
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddActivity({
      title: newTitle.trim(),
      scope: newScope.trim() || 'General Operations',
      status: newStatus,
      progress: parseInt(newProgress, 10) || 0,
      dueDate: 'Nov 18',
      statusPill: newStatus === 'ongoing' ? 'On Pace' : newStatus === 'completed' ? 'Completed' : 'Queued',
      assignedTeam: newTeam,
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewScope('');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 pb-12">
      {/* Overview Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase font-bold text-[#44474d] tracking-wider">
            Active Velocity
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-bold text-[#216293]">94.2</span>
            <span className="text-xs text-[#216293] font-bold">%</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#44474d] text-[10px] font-mono">
            <TrendingUp className="w-3 h-3 text-[#216293]" />
            <span>+1.8% vs base</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase font-bold text-[#ba1a1a] tracking-wider">
            Critical Path
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-bold text-[#ba1a1a]">2</span>
            <span className="text-xs text-[#ba1a1a] font-semibold">flags</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#ba1a1a] text-[10px] font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>+6d total slip</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-[#c4c6ce]/30 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase font-bold text-[#44474d] tracking-wider">
            QA Passed
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-bold text-[#0b1c30]">14</span>
            <span className="text-xs text-[#44474d]">/14</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#44474d] text-[10px] font-mono">
            <CheckCircle2 className="w-3 h-3 text-[#216293]" />
            <span>100% signoff</span>
          </div>
        </div>
      </div>

      {/* Delay Alert Banner (Urgent Action Center) */}
      {showAlertsBanner && alerts.length > 0 && (
        <section className="bg-[#ffdad6] text-[#410002] rounded-xl p-4 shadow-sm border border-[#ffdad6] relative overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[#93000a]">
                  {alerts.length} Delay Alerts Requiring Action
                </h2>
                <p className="text-xs text-[#410002]/80">Schedule impacts on secondary critical path</p>
              </div>
            </div>
            <button
              onClick={() => setShowAlertsBanner(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#93000a] hover:bg-[#ba1a1a]/10 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert Items List */}
          <div className="space-y-2 mb-3">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="bg-white/95 rounded-lg p-2.5 flex items-center justify-between text-[#0b1c30] shadow-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{al.title}</p>
                    <p className="text-[11px] text-[#44474d] truncate">{al.reason}</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] shrink-0">
                  {al.slip}
                </span>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRescheduleModalOpen(true)}
              className="flex-1 h-9 px-3 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg font-mono text-[11px] uppercase font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Acknowledge & Reschedule</span>
            </button>
            <button
              onClick={() => setViewPathModalOpen(true)}
              className="h-9 px-3 bg-white text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg font-mono text-[11px] uppercase font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
            >
              <span>View Path</span>
            </button>
          </div>
        </section>
      )}

      {/* Filter Tabs & Add Button */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All Activities', count: activities.length },
            { id: 'ongoing', label: 'Ongoing', count: activities.filter((a) => a.status === 'ongoing').length },
            { id: 'pending', label: 'Pending', count: activities.filter((a) => a.status === 'pending').length },
            { id: 'completed', label: 'Completed', count: activities.filter((a) => a.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`shrink-0 h-8 px-3 rounded-full font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                filter === tab.id
                  ? 'bg-[#0f2744] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#44474d] hover:text-[#0b1c30] hover:bg-[#e5eeff]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filter === tab.id ? 'bg-white/20 text-white' : 'bg-[#dce9ff] text-[#216293] font-bold'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="shrink-0 h-8 px-3 bg-[#216293] hover:bg-[#025283] text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Activity</span>
        </button>
      </div>

      {/* Fast Post Progress Quick-Log */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#216293]" />
            <h3 className="font-bold text-sm text-[#0b1c30]">Field Status Quick-Log</h3>
          </div>
          <span className="font-mono text-[11px] text-[#44474d]">Phase 3B • Live Sync</span>
        </div>

        <form onSubmit={handleQuickSubmit} className="bg-[#eff4ff] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg px-3 py-2 flex items-center gap-2 shadow-2xs border border-[#d3e4fe]">
              <input
                type="text"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Log progress, weld inspections, delay notes..."
                className="w-full bg-transparent text-xs text-[#0b1c30] placeholder:text-[#74777e] focus:outline-none"
              />
            </div>
            <div className="w-24 bg-white rounded-lg px-2 py-2 flex items-center gap-1 shadow-2xs border border-[#d3e4fe] shrink-0">
              <span className="font-mono text-xs text-[#44474d]">%</span>
              <input
                type="number"
                min="0"
                max="100"
                value={quickPercent}
                onChange={(e) => setQuickPercent(e.target.value)}
                placeholder="65"
                className="w-full bg-transparent font-mono text-xs text-[#0b1c30] focus:outline-none text-right font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-white text-[#44474d] hover:text-[#216293] flex items-center justify-center shadow-2xs border border-[#d3e4fe]"
                title="Attach photo"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-white text-[#44474d] hover:text-[#216293] flex items-center justify-center shadow-2xs border border-[#d3e4fe]"
                title="Add Geo Location"
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-[#74777e] ml-1 hidden sm:inline">
                Autostamped by Lead Eng
              </span>
            </div>

            <button
              type="submit"
              className="h-8 px-3.5 bg-[#0f2744] hover:bg-[#216293] text-white rounded-lg font-mono text-[11px] uppercase font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#89ceff]" />
              <span>Post Update</span>
            </button>
          </div>
        </form>
      </section>

      {/* Recent Progress Log Feed */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-mono text-[11px] uppercase font-bold text-[#44474d] tracking-wider">
            Recent Progress Feed
          </h3>
          <span className="font-mono text-[11px] text-[#216293] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#216293] animate-pulse" />
            Streaming Updates
          </span>
        </div>

        {feed.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#c4c6ce]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs text-[#0b1c30] truncate">{item.author.name}</span>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#216293] font-bold">
                      {item.author.role}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#74777e]">{item.timestamp}</span>
                </div>
              </div>

              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#e5eeff] text-[#216293] shrink-0 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#216293]" />
                {item.badge}
              </span>
            </div>

            <p className="text-xs text-[#0b1c30] leading-relaxed">{item.content}</p>

            {/* Inspection photos thumbnail grid */}
            {item.images && item.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {item.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto({ url: img.url, title: img.filename })}
                    className="relative group rounded-lg overflow-hidden h-28 bg-[#eff4ff] shadow-2xs cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-[#0f2744]/90 to-transparent flex items-center justify-between text-white font-mono text-[10px]">
                      <span className="truncate">{img.filename}</span>
                      <Maximize2 className="w-3 h-3 shrink-0 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reactions & System Sync footer */}
            <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff] text-[#44474d] font-mono text-[11px]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLikeFeed(item.id)}
                  className="flex items-center gap-1 hover:text-[#216293] transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{item.likes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{item.commentsCount}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#74777e]">{item.systemTag}</span>
            </div>
          </article>
        ))}
      </section>

      {/* Operational Activity Board Cards */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-mono text-[11px] uppercase font-bold text-[#44474d] tracking-wider">
            Operational Activity Board
          </h3>
          <span className="font-mono text-[11px] text-[#44474d]">Sorted by Priority</span>
        </div>

        {filteredActivities.map((act) => (
          <article
            key={act.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#216293] font-bold">
                    {act.code}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                      act.status === 'completed'
                        ? 'bg-[#ecfdf5] text-[#047857]'
                        : act.delayWarning
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#e5eeff] text-[#216293]'
                    }`}
                  >
                    {act.statusPill}
                  </span>
                  {act.delayWarning && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      {act.delayWarning}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-[#0b1c30] truncate">{act.title}</h4>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] uppercase text-[#74777e] block">
                  {act.status === 'completed' ? 'Closed On' : 'Due Date'}
                </span>
                <span className="font-mono text-xs text-[#0b1c30] font-bold">{act.dueDate}</span>
              </div>
            </div>

            {/* Progress Metric & Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#44474d] truncate">{act.scope}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`font-bold ${
                      act.status === 'completed'
                        ? 'text-[#047857]'
                        : act.delayWarning
                        ? 'text-[#ba1a1a]'
                        : 'text-[#216293]'
                    }`}
                  >
                    {act.progress}%
                  </span>
                  {act.expectedProgress && (
                    <span className="text-[#74777e] line-through text-[10px]">
                      {act.expectedProgress}% exp
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    act.status === 'completed'
                      ? 'bg-[#047857]'
                      : act.delayWarning
                      ? 'bg-[#0f2744]'
                      : 'bg-[#216293]'
                  }`}
                  style={{ width: `${act.progress}%` }}
                />
                {act.expectedProgress && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#ba1a1a]"
                    style={{ left: `${act.expectedProgress}%` }}
                  />
                )}
              </div>
            </div>

            {/* Prerequisite block */}
            {act.prerequisite && (
              <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-start gap-2 text-xs">
                <Lock className="w-4 h-4 text-[#216293] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] uppercase text-[#74777e] font-bold block">
                    Blocking Prerequisite
                  </span>
                  <p className="text-xs text-[#0b1c30] mt-0.5">{act.prerequisite.text}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-[#d3e4fe] overflow-hidden">
                      <div
                        className="h-full bg-[#216293] rounded-full"
                        style={{ width: `${act.prerequisite.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[#216293] font-bold">
                      {act.prerequisite.progress}% Done
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Signoff banner */}
            {act.signoff && (
              <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#216293] shrink-0" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#216293] block">
                      100% Digital Signoff
                    </span>
                    <p className="text-xs text-[#0b1c30]">{act.signoff.certifiedBy}</p>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded border border-[#216293]/40 text-[#216293] font-mono text-[10px] font-bold uppercase tracking-wider rotate-[-2deg]">
                  {act.signoff.badge}
                </div>
              </div>
            )}

            {/* Responsible Lead or Squad */}
            <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
              {act.lead ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#dce9ff] text-[#025283] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {act.lead.initials}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#0b1c30] truncate block">
                      {act.lead.name}
                    </span>
                    <span className="text-[10px] text-[#74777e] truncate block">{act.lead.role}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#44474d]">{act.assignedTeam}:</span>
                  <div className="flex items-center -space-x-1.5">
                    {(act.teamMembers || []).map((m, idx) => (
                      <div
                        key={idx}
                        className={`w-5 h-5 rounded-full ${m.bg} text-white font-mono text-[8px] font-bold flex items-center justify-center ring-1 ring-white`}
                      >
                        {m.initials}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {act.signoff ? (
                <button
                  onClick={() => alert('Downloading official signoff certificate PDF...')}
                  className="h-7 px-2.5 bg-[#eff4ff] text-[#216293] hover:bg-[#dce9ff] rounded font-mono text-[10px] uppercase font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Certificate (.pdf)</span>
                </button>
              ) : act.lead ? (
                <button
                  onClick={() => alert(`Calling ${act.lead?.name} via radio channel...`)}
                  className="h-7 px-2.5 bg-[#0f2744] hover:bg-[#216293] text-white rounded font-mono text-[10px] uppercase font-semibold flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Contact</span>
                </button>
              ) : (
                <button
                  onClick={() => alert(`Inspecting log entries for ${act.code}...`)}
                  className="h-7 px-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#216293] rounded font-mono text-[10px] uppercase font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Log</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="bg-[#0f2744] text-white rounded-xl p-4 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#8ec6fd]" />
                <span className="font-bold text-sm">Dynamic Critical Path Rescheduled</span>
              </div>
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Applied 48h buffer adjustment to secondary critical path (Sector C and Substation).
              Baseline target date remains Nov 28, 2025.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onAcknowledgeAlerts();
                  setRescheduleModalOpen(false);
                }}
                className="px-3 py-1.5 bg-white text-[#0f2744] font-mono text-xs font-bold rounded-lg hover:bg-[#eff4ff]"
              >
                Accept & Dismiss Alerts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Path Modal */}
      {viewPathModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-xl p-4 max-w-md w-full shadow-xl space-y-3 border border-[#c4c6ce]">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
              <span className="font-bold text-sm text-[#0b1c30]">Critical Path Analysis</span>
              <button onClick={() => setViewPathModalOpen(false)} className="text-[#44474d] hover:text-[#0b1c30]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs space-y-2 font-mono text-[#0b1c30]">
              <div className="p-2 bg-[#eff4ff] rounded">
                <strong>1. Site Excavation Sector C:</strong> Flash flood buffer absorbed +2d slack.
              </div>
              <div className="p-2 bg-[#ffdad6]/60 rounded">
                <strong>2. Substation Transformer:</strong> 4d customs delay mitigable via priority port dispatch waiver.
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setViewPathModalOpen(false)}
                className="px-3 py-1.5 bg-[#0f2744] text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full bg-[#0f2744] rounded-xl overflow-hidden shadow-2xl">
            <img src={selectedPhoto.url} alt="" className="w-full h-auto max-h-[75vh] object-contain" />
            <div className="p-3 flex items-center justify-between text-white font-mono text-xs">
              <span>{selectedPhoto.title}</span>
              <span>Tap anywhere to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Add New Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-xl p-4 max-w-md w-full shadow-2xl space-y-3 border border-[#c4c6ce]">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
              <span className="font-bold text-sm text-[#0b1c30]">Create Project Activity</span>
              <button onClick={() => setShowAddModal(false)} className="text-[#44474d] hover:text-[#0b1c30]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., HVAC Pressure Relief Testing"
                  className="w-full p-2 border border-[#c4c6ce] rounded-lg focus:outline-none focus:border-[#216293]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Scope & Detail</label>
                <input
                  type="text"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  placeholder="e.g., Section 4 Conduit and Trunking"
                  className="w-full p-2 border border-[#c4c6ce] rounded-lg focus:outline-none focus:border-[#216293]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full p-2 border border-[#c4c6ce] rounded-lg focus:outline-none focus:border-[#216293]"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                    className="w-full p-2 border border-[#c4c6ce] rounded-lg font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Assigned Team / Bureau</label>
                <input
                  type="text"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  className="w-full p-2 border border-[#c4c6ce] rounded-lg focus:outline-none focus:border-[#216293]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eff4ff]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-[#eff4ff] text-[#44474d] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f2744] hover:bg-[#216293] text-white rounded-lg font-semibold"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
