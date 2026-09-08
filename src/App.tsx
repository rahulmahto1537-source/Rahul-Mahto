import React, { useState, useEffect } from 'react';
import {
  Project,
  Milestone,
  GanttTask,
  Activity,
  FeedUpdate,
  DocumentItem,
  DelayAlert,
  User,
  NavTab,
} from './types.ts';
import { api } from './api.ts';
import { Navbar } from './components/Navbar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { TimelineView } from './components/TimelineView.tsx';
import { ActivitiesView } from './components/ActivitiesView.tsx';
import { MediaDocsView } from './components/MediaDocsView.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { Flag, X, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<DelayAlert[]>([]);
  const [feed, setFeed] = useState<FeedUpdate[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Modals
  const [loginOpen, setLoginOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [flagDelayOpen, setFlagDelayOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);

  // Form states
  const [delayTitle, setDelayTitle] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [delayDays, setDelayDays] = useState('2');

  const [quickLogText, setQuickLogText] = useState('');
  const [quickLogPercent, setQuickLogPercent] = useState('75');

  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3500);
  };

  // Initial data loading from Express backend API
  useEffect(() => {
    async function loadData() {
      const [
        loadedProjects,
        loadedMilestones,
        loadedTasks,
        loadedActivities,
        loadedAlerts,
        loadedFeed,
        loadedDocs,
        loadedUser,
        loadedUsers,
      ] = await Promise.all([
        api.getProjects(),
        api.getMilestones(),
        api.getGanttTasks(),
        api.getActivities(),
        api.getAlerts(),
        api.getFeed(),
        api.getDocuments(),
        api.getCurrentUser(),
        api.getUsers(),
      ]);

      setProjects(loadedProjects);
      if (loadedProjects.length > 0) {
        setActiveProject(loadedProjects[0]);
      }
      setMilestones(loadedMilestones);
      setTasks(loadedTasks);
      setActivities(loadedActivities);
      setAlerts(loadedAlerts);
      setFeed(loadedFeed);
      setDocuments(loadedDocs);
      setCurrentUser(loadedUser);
      setUsers(loadedUsers);
    }
    loadData();
  }, []);

  // Handlers
  const handleUpdateTask = async (id: string, updates: Partial<GanttTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    await api.updateGanttTask(id, updates);
  };

  const handleAddActivity = async (act: Partial<Activity>) => {
    const newAct = await api.createActivity(act);
    setActivities((prev) => [newAct, ...prev]);
    showToast(`Added activity: ${newAct.title}`);
  };

  const handlePostFeed = async (content: string, progress?: number, image?: string) => {
    const newUpdate = await api.postFeedUpdate(content, progress, image);
    setFeed((prev) => [newUpdate, ...prev]);
    showToast('Daily field progress update published to live feed');
  };

  const handleLikeFeed = async (id: string) => {
    const newLikes = await api.likeFeedItem(id);
    setFeed((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: newLikes } : item))
    );
  };

  const handleAcknowledgeAlerts = async () => {
    await api.acknowledgeAlerts();
    setAlerts([]);
    showToast('Critical path buffer adjusted. Alerts dismissed.');
  };

  const handleUploadDocument = async (doc: Partial<DocumentItem>) => {
    const created = await api.uploadDocument(doc);
    setDocuments((prev) => [created, ...prev]);
  };

  const handleLogin = async (email: string) => {
    const user = await api.login(email);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name} (${user.role})`);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    showToast('Signed out of authorized portal');
  };

  const handleSwitchUser = async (userId: string) => {
    const user = await api.switchUser(userId);
    setCurrentUser(user);
    showToast(`Switched persona to ${user.name} (${user.role})`);
  };

  const handleCreateDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayTitle.trim()) return;
    const newAlert: DelayAlert = {
      id: `alert-${Date.now()}`,
      title: delayTitle.trim(),
      reason: delayReason.trim() || 'Schedule variance identified',
      slip: `+${delayDays}d slip`,
      impact: 'Critical path impact',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    if (activeProject) {
      setActiveProject({
        ...activeProject,
        criticalRisks: activeProject.criticalRisks + 1,
        status: 'Delayed',
      });
    }
    setFlagDelayOpen(false);
    setDelayTitle('');
    setDelayReason('');
    showToast(`Delay flagged: +${delayDays}d for "${newAlert.title}"`);
  };

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogText.trim()) return;
    handlePostFeed(
      quickLogText.trim(),
      quickLogPercent ? parseInt(quickLogPercent, 10) : undefined
    );
    setQuickLogOpen(false);
    setQuickLogText('');
  };

  const handleRunSimulation = () => {
    if (activeProject) {
      setActiveProject({
        ...activeProject,
        healthPercentage: Math.min(100, activeProject.healthPercentage + 4),
        daysDelta: '+6 Days Ahead',
      });
    }
    setSimulateOpen(false);
    showToast('Critical path simulation applied: +4% health recovery calculated!');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#dce9ff] selection:text-[#0b1c30]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setLoginOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        users={users}
        unreadAlertCount={alerts.length}
      />

      {/* Main Content View with top and bottom paddings */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 px-3 sm:px-6 pb-20 md:pb-12">
        {globalToast && (
          <div className="max-w-xl mx-auto mb-3 p-3 bg-[#0f2744] text-white rounded-xl shadow-lg font-mono text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#89ceff]" />
              <span>{globalToast}</span>
            </div>
            <button onClick={() => setGlobalToast(null)} className="text-white/70 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Router */}
        {activeTab === 'dashboard' && activeProject && (
          <DashboardView
            projects={projects}
            activeProject={activeProject}
            onSelectProject={setActiveProject}
            milestones={milestones}
            setActiveTab={setActiveTab}
            onOpenQuickLog={() => setQuickLogOpen(true)}
            onFlagDelay={() => setFlagDelayOpen(true)}
            onSimulateSchedule={() => setSimulateOpen(true)}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView tasks={tasks} onUpdateTask={handleUpdateTask} />
        )}

        {activeTab === 'activities' && (
          <ActivitiesView
            activities={activities}
            feed={feed}
            alerts={alerts}
            onAddActivity={handleAddActivity}
            onPostFeed={handlePostFeed}
            onLikeFeed={handleLikeFeed}
            onAcknowledgeAlerts={handleAcknowledgeAlerts}
          />
        )}

        {activeTab === 'media-docs' && (
          <MediaDocsView
            documents={documents}
            onUploadDocument={handleUploadDocument}
          />
        )}
      </main>

      {/* Bottom Mobile Tab Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Login Authentication Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        users={users}
        currentUser={currentUser}
      />

      {/* Quick Log Modal */}
      {quickLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-xl border border-[#c4c6ce] space-y-3">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
              <span className="font-bold text-sm text-[#0b1c30]">Post Daily Field Progress</span>
              <button onClick={() => setQuickLogOpen(false)} className="text-[#44474d] hover:text-[#0b1c30]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleQuickLogSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Update Summary</label>
                <textarea
                  required
                  rows={3}
                  value={quickLogText}
                  onChange={(e) => setQuickLogText(e.target.value)}
                  placeholder="e.g. Ultrasonic inspection passed for Sectors 3-5. Concrete batch delivered on time."
                  className="w-full p-2.5 border border-[#c4c6ce] rounded-lg focus:outline-none focus:border-[#216293]"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="font-bold text-[#0b1c30]">Current Progress %:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quickLogPercent}
                  onChange={(e) => setQuickLogPercent(e.target.value)}
                  className="w-20 p-2 border border-[#c4c6ce] rounded-lg font-mono font-bold text-center"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#eff4ff]">
                <button
                  type="button"
                  onClick={() => setQuickLogOpen(false)}
                  className="px-3 py-1.5 bg-[#eff4ff] text-[#44474d] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f2744] hover:bg-[#216293] text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#89ceff]" />
                  <span>Publish Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flag Delay Alert Modal */}
      {flagDelayOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-xl border border-[#c4c6ce] space-y-3">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
              <div className="flex items-center gap-2 text-[#ba1a1a]">
                <Flag className="w-4 h-4" />
                <span className="font-bold text-sm text-[#ba1a1a]">Flag Schedule Delay</span>
              </div>
              <button onClick={() => setFlagDelayOpen(false)} className="text-[#44474d] hover:text-[#0b1c30]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDelay} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Work Package Affected</label>
                <input
                  type="text"
                  required
                  value={delayTitle}
                  onChange={(e) => setDelayTitle(e.target.value)}
                  placeholder="e.g., Pylon Curing Deck 4A"
                  className="w-full p-2 border border-[#c4c6ce] rounded-lg focus:outline-none focus:border-[#ba1a1a]"
                />
              </div>
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Root Cause & Impediment</label>
                <input
                  type="text"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="e.g., Heavy rain runoff delay, material batch shipment hold"
                  className="w-full p-2 border border-[#c4c6ce] rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Estimated Slip (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={delayDays}
                  onChange={(e) => setDelayDays(e.target.value)}
                  className="w-24 p-2 border border-[#c4c6ce] rounded-lg font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#eff4ff]">
                <button
                  type="button"
                  onClick={() => setFlagDelayOpen(false)}
                  className="px-3 py-1.5 bg-[#eff4ff] text-[#44474d] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Log Delay Risk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulate Schedule Modal */}
      {simulateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f2744] text-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#89ceff]" />
                <span className="font-bold text-sm">Monte Carlo Critical Path Simulation</span>
              </div>
              <button onClick={() => setSimulateOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Evaluating 10,000 iterations across current work packages. Applying double-shift acceleration to Truss Grid 1-8 yields a <strong>+4% schedule recovery</strong> with zero budget penalty.
            </p>
            <div className="p-3 bg-white/10 rounded-lg text-xs font-mono">
              <div>• Target Date: Nov 28, 2025 (Maintained)</div>
              <div>• Confidence Interval: 96.4% P80</div>
              <div>• Slack buffer: +6 Days Ahead</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSimulateOpen(false)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunSimulation}
                className="px-4 py-1.5 bg-[#89ceff] hover:bg-[#b2dcff] text-[#0f2744] font-mono text-xs font-bold rounded-lg shadow-sm"
              >
                Apply Accelerated Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
