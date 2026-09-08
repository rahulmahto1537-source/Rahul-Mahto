import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initialProjects,
  initialMilestones,
  initialGanttTasks,
  initialActivities,
  initialDelayAlerts,
  initialFeed,
  initialDocuments,
  initialUsers,
  Project,
  Milestone,
  GanttTask,
  Activity,
  FeedUpdate,
  DocumentItem,
  User,
} from './src/server/data.ts';

// In-memory persistent state (or persistent JSON store)
let projects: Project[] = [...initialProjects];
let milestones: Milestone[] = [...initialMilestones];
let ganttTasks: GanttTask[] = [...initialGanttTasks];
let activities: Activity[] = [...initialActivities];
let delayAlerts = [...initialDelayAlerts];
let feedUpdates: FeedUpdate[] = [...initialFeed];
let documents: DocumentItem[] = [...initialDocuments];
const users: User[] = [...initialUsers];

// Simple token-based session simulation
let currentUser: User | null = users[0]; // Default logged in as Lead Engineer Marcus Chen

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // --- API Routes ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Chronos Project Management API', uptime: process.uptime() });
  });

  // Auth Routes
  app.get('/api/auth/me', (req, res) => {
    if (!currentUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user: currentUser });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Sample accounts login or quick demo login
    const found = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (found) {
      currentUser = found;
      return res.json({ success: true, user: found });
    }
    // Fallback: create or accept test demo user
    const newUser: User = {
      id: `u-${Date.now()}`,
      email: email || 'demo@chronos.eng',
      name: email ? email.split('@')[0].replace('.', ' ') : 'Demo User',
      role: 'Project Manager',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkrLFkuOQCOzCOkWORpgfZL9MwVqqgnqeSiSE2LWKwx_ZVnQjCYjY5ROTGzEn_1JBaeFl5UBcwX-LHkXbOimECVDL4iwYRwk8y3ZilotWRKVk83EK3kuCJp2Y2x0iaNPDrCtSnS8mdFwqF-90Z1KgKyPm70Fm0gNXBoPjVptHavKOcZQzrYN2J-5Cdy_PskuMWwPwpdu-1mL-NxAeq17yzO--31XrGda4kxnhHbUU8R_2nWnGSzqQkZg',
      permissions: 'Manager View • Full Edit Access Enabled',
    };
    currentUser = newUser;
    res.json({ success: true, user: newUser });
  });

  app.post('/api/auth/logout', (req, res) => {
    currentUser = null;
    res.json({ success: true, message: 'Logged out' });
  });

  app.get('/api/users', (req, res) => {
    res.json({ users });
  });

  app.post('/api/auth/switch-user', (req, res) => {
    const { userId } = req.body;
    const target = users.find((u) => u.id === userId);
    if (target) {
      currentUser = target;
      return res.json({ success: true, user: target });
    }
    res.status(404).json({ error: 'User not found' });
  });

  // Projects Endpoints
  app.get('/api/projects', (req, res) => {
    res.json({ projects });
  });

  app.get('/api/projects/:id', (req, res) => {
    const project = projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  });

  app.post('/api/projects', (req, res) => {
    const newProject: Project = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: req.body.name || 'New Infrastructure Project',
      code: req.body.code || `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      sector: req.body.sector || 'Primary Sector',
      status: req.body.status || 'On Track',
      sprint: req.body.sprint || 'Sprint 1',
      velocity: req.body.velocity || 40,
      healthPercentage: req.body.healthPercentage || 50,
      targetCompletion: req.body.targetCompletion || 'Dec 31, 2026',
      daysDelta: '+0 Days',
      activeLoad: 1,
      totalTasks: 10,
      ongoingTasks: 5,
      completedMilestones: 0,
      criticalRisks: 0,
    };
    projects.push(newProject);
    res.status(201).json({ project: newProject });
  });

  // Milestones Endpoints
  app.get('/api/milestones', (req, res) => {
    res.json({ milestones });
  });

  app.patch('/api/milestones/:id', (req, res) => {
    const { id } = req.params;
    const idx = milestones.findIndex((m) => m.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Milestone not found' });
    milestones[idx] = { ...milestones[idx], ...req.body };
    res.json({ milestone: milestones[idx] });
  });

  // Gantt Tasks Endpoints
  app.get('/api/gantt', (req, res) => {
    res.json({ tasks: ganttTasks });
  });

  app.patch('/api/gantt/:id', (req, res) => {
    const { id } = req.params;
    const idx = ganttTasks.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    ganttTasks[idx] = { ...ganttTasks[idx], ...req.body };
    res.json({ task: ganttTasks[idx] });
  });

  // Activities Endpoints
  app.get('/api/activities', (req, res) => {
    const { status } = req.query;
    if (status && typeof status === 'string' && status !== 'all') {
      return res.json({ activities: activities.filter((a) => a.status === status) });
    }
    res.json({ activities });
  });

  app.post('/api/activities', (req, res) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      code: `ACT-${Math.floor(500 + Math.random() * 400)}`,
      title: req.body.title || 'Untitled Activity',
      scope: req.body.scope || 'Standard Inspection & Assembly',
      status: req.body.status || 'ongoing',
      progress: Number(req.body.progress) || 0,
      dueDate: req.body.dueDate || 'Nov 15',
      statusPill: req.body.statusPill || 'On Pace',
      assignedTeam: req.body.assignedTeam || 'Civil Ops',
      lead: req.body.lead || {
        name: currentUser?.name || 'Site Lead',
        role: currentUser?.role || 'Lead Engineer',
        initials: (currentUser?.name || 'SL').split(' ').map((n) => n[0]).join(''),
      },
    };
    activities.unshift(newActivity);
    res.status(201).json({ activity: newActivity });
  });

  app.patch('/api/activities/:id', (req, res) => {
    const { id } = req.params;
    const idx = activities.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Activity not found' });
    activities[idx] = { ...activities[idx], ...req.body };
    res.json({ activity: activities[idx] });
  });

  // Progress Feed Endpoints
  app.get('/api/feed', (req, res) => {
    res.json({ feed: feedUpdates });
  });

  app.post('/api/feed', (req, res) => {
    const { content, progress, image } = req.body;
    const newUpdate: FeedUpdate = {
      id: `f-${Date.now()}`,
      author: {
        name: currentUser?.name || 'Lead Engineer',
        role: currentUser?.role || 'Field Engineer',
        avatar: currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkrLFkuOQCOzCOkWORpgfZL9MwVqqgnqeSiSE2LWKwx_ZVnQjCYjY5ROTGzEn_1JBaeFl5UBcwX-LHkXbOimECVDL4iwYRwk8y3ZilotWRKVk83EK3kuCJp2Y2x0iaNPDrCtSnS8mdFwqF-90Z1KgKyPm70Fm0gNXBoPjVptHavKOcZQzrYN2J-5Cdy_PskuMWwPwpdu-1mL-NxAeq17yzO--31XrGda4kxnhHbUU8R_2nWnGSzqQkZg',
        verified: true,
      },
      timestamp: 'Just now',
      content: content || 'Quick site status logged.',
      badge: progress ? `${progress}% Logged` : 'Field Log',
      badgeColor: 'text-[#216293] bg-[#e5eeff]',
      images: image ? [{ url: image, filename: 'field-upload.jpg', alt: 'Site photo' }] : undefined,
      systemTag: 'Synced to Master Gantt',
      likes: 0,
      commentsCount: 0,
    };
    feedUpdates.unshift(newUpdate);
    res.status(201).json({ update: newUpdate });
  });

  app.post('/api/feed/:id/like', (req, res) => {
    const item = feedUpdates.find((f) => f.id === req.params.id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      return res.json({ likes: item.likes });
    }
    res.status(404).json({ error: 'Feed item not found' });
  });

  // Delays and Alerts Endpoints
  app.get('/api/alerts', (req, res) => {
    res.json({ alerts: delayAlerts });
  });

  app.post('/api/alerts/acknowledge', (req, res) => {
    const { alertId } = req.body;
    if (alertId) {
      delayAlerts = delayAlerts.filter((a) => a.id !== alertId);
    } else {
      delayAlerts = [];
    }
    res.json({ success: true, remaining: delayAlerts.length });
  });

  // Documents & Media Upload Endpoints
  app.get('/api/documents', (req, res) => {
    const { category } = req.query;
    if (category && typeof category === 'string' && category !== 'all') {
      return res.json({ documents: documents.filter((d) => d.category === category) });
    }
    res.json({ documents });
  });

  app.post('/api/documents/upload', (req, res) => {
    const { title, category, fileType, revision, thumbnail, diffNotes, notes } = req.body;

    // Automatic next revision detection if not specified
    const nextRev = revision || (category === 'drawings' ? 'REV-E' : 'INSP-30');

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      category: category || 'drawings',
      title: title || `DWG-${Math.floor(100 + Math.random() * 900)}-Revision-${nextRev}`,
      filename: title ? `${title}.${(fileType || 'pdf').toLowerCase()}` : `CAD-DWG-${nextRev}.pdf`,
      revision: nextRev,
      statusBadge: category === 'drawings' ? 'Pending Engineering Review' : 'Verified Field Photo',
      statusType: category === 'drawings' ? 'review' : 'approved',
      version: 'v1.0',
      updatedAt: `Updated Just now by ${currentUser?.name || 'Lead Arch'}`,
      author: currentUser?.name || 'Lead Arch',
      thumbnail:
        thumbnail ||
        (category === 'photos'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_x9u2rxSqWfmDPuKfPafJCdm5RqH1EdqFzPRHNOtgNg3DJWuF9KLEr2_pBRhPuVm1Tcv3GUgKK65Ts44YK4QFAmOzHWXW35QOkD4OmyydSJ9gs8_g_VL3wTozvigMjqN_ZVq82OTQ2qjAY5GYyyE07bYXQMvoPJVm7jeTVvpTXHeHVQXxz5Kh6SsXiWXKUmmG_A2hvNI-MhjeixuYYV69rGHCvqLiFgKlvqtIe8_DKAUQYkWqx2AgRQ'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivoSuEV3-t_NBTQuVpDYxw96iS-Q0Ga730bYqCzNKZbItIp2UGUswa9suH-oQd85nl0yQ95xzFu041AdJ3pptm4wU6tbVprPUEHQCOpUfi7yMadwJM5Sziw1yjtgHIRyIwNuJvV3l_N5yl12StfH8PhcA7g-PImkajhxFSMCkc9lsa8qq6sCip3bUGK9SYopQ84wAiFfaPhO5DYl-FKKWy8heAjhLPRXh07pcDf4JP82MUQ-05WXjmA'),
      fileType: (fileType || 'PDF').toUpperCase() as any,
      diffNotes: diffNotes || {
        additions: '+2 modified nodes',
        removals: '-0 changes',
        hash: Math.random().toString(36).substring(2, 8),
      },
      sectorTag: 'Sector 4 Extension',
      slaRemaining: 'SLA Deadline: 24h remaining',
    };

    documents.unshift(newDoc);
    res.status(201).json({ document: newDoc });
  });

  // Vite Middleware Setup for dev vs static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chronos Express server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
