import {
  Project,
  Milestone,
  GanttTask,
  Activity,
  FeedUpdate,
  DocumentItem,
  DelayAlert,
  User,
} from './types.ts';
import {
  initialProjects,
  initialMilestones,
  initialGanttTasks,
  initialActivities,
  initialDelayAlerts,
  initialFeed,
  initialDocuments,
  initialUsers,
} from './server/data.ts';

// Helper to communicate with our Express API endpoints
export const api = {
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        return data.projects;
      }
    } catch (e) {
      console.warn('API /api/projects failed, using local store', e);
    }
    return initialProjects;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        const data = await res.json();
        return data.project;
      }
    } catch (e) {
      console.warn('API /api/projects post failed', e);
    }
    return {
      id: `PRJ-${Date.now()}`,
      name: project.name || 'New Infrastructure Project',
      code: project.code || 'PRJ-100',
      sector: project.sector || 'Primary Expansion',
      status: project.status || 'On Track',
      sprint: project.sprint || 'Sprint 1',
      velocity: 40,
      healthPercentage: 50,
      targetCompletion: 'Dec 31, 2026',
      daysDelta: '+0 Days',
      activeLoad: 1,
      totalTasks: 10,
      ongoingTasks: 5,
      completedMilestones: 0,
      criticalRisks: 0,
    };
  },

  async getMilestones(): Promise<Milestone[]> {
    try {
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const data = await res.json();
        return data.milestones;
      }
    } catch (e) {
      console.warn('API /api/milestones failed', e);
    }
    return initialMilestones;
  },

  async getGanttTasks(): Promise<GanttTask[]> {
    try {
      const res = await fetch('/api/gantt');
      if (res.ok) {
        const data = await res.json();
        return data.tasks;
      }
    } catch (e) {
      console.warn('API /api/gantt failed', e);
    }
    return initialGanttTasks;
  },

  async updateGanttTask(id: string, updates: Partial<GanttTask>): Promise<GanttTask | null> {
    try {
      const res = await fetch(`/api/gantt/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return data.task;
      }
    } catch (e) {
      console.warn('API update task failed', e);
    }
    return null;
  },

  async getActivities(): Promise<Activity[]> {
    try {
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        return data.activities;
      }
    } catch (e) {
      console.warn('API /api/activities failed', e);
    }
    return initialActivities;
  },

  async createActivity(activity: Partial<Activity>): Promise<Activity> {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      if (res.ok) {
        const data = await res.json();
        return data.activity;
      }
    } catch (e) {
      console.warn('API create activity failed', e);
    }
    return {
      id: `act-${Date.now()}`,
      code: 'ACT-999',
      title: activity.title || 'New Activity',
      scope: activity.scope || 'Inspection & Assembly',
      status: activity.status || 'ongoing',
      progress: activity.progress || 0,
      dueDate: activity.dueDate || 'Nov 15',
      statusPill: activity.statusPill || 'On Pace',
      assignedTeam: activity.assignedTeam || 'Civil Ops',
    };
  },

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | null> {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return data.activity;
      }
    } catch (e) {
      console.warn('API update activity failed', e);
    }
    return null;
  },

  async getFeed(): Promise<FeedUpdate[]> {
    try {
      const res = await fetch('/api/feed');
      if (res.ok) {
        const data = await res.json();
        return data.feed;
      }
    } catch (e) {
      console.warn('API /api/feed failed', e);
    }
    return initialFeed;
  },

  async postFeedUpdate(content: string, progress?: number, image?: string): Promise<FeedUpdate> {
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, progress, image }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.update;
      }
    } catch (e) {
      console.warn('API post feed failed', e);
    }
    return {
      id: `f-${Date.now()}`,
      author: {
        name: 'Marcus Chen',
        role: 'Lead Engineer',
        avatar: initialUsers[0].avatar,
        verified: true,
      },
      timestamp: 'Just now',
      content,
      badge: progress ? `${progress}% Logged` : 'Field Log',
      badgeColor: 'text-[#216293] bg-[#e5eeff]',
      likes: 0,
      commentsCount: 0,
    };
  },

  async likeFeedItem(id: string): Promise<number> {
    try {
      const res = await fetch(`/api/feed/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.likes;
      }
    } catch (e) {
      console.warn('API like feed failed', e);
    }
    return 1;
  },

  async getAlerts(): Promise<DelayAlert[]> {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        return data.alerts;
      }
    } catch (e) {
      console.warn('API /api/alerts failed', e);
    }
    return initialDelayAlerts;
  },

  async acknowledgeAlerts(alertId?: string): Promise<void> {
    try {
      await fetch('/api/alerts/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
    } catch (e) {
      console.warn('API acknowledge alert failed', e);
    }
  },

  async getDocuments(category?: string): Promise<DocumentItem[]> {
    try {
      const url = category ? `/api/documents?category=${category}` : '/api/documents';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.documents;
      }
    } catch (e) {
      console.warn('API /api/documents failed', e);
    }
    return initialDocuments;
  },

  async uploadDocument(doc: Partial<DocumentItem>): Promise<DocumentItem> {
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (res.ok) {
        const data = await res.json();
        return data.document;
      }
    } catch (e) {
      console.warn('API upload document failed', e);
    }
    return {
      id: `doc-${Date.now()}`,
      category: doc.category || 'drawings',
      title: doc.title || 'Uploaded-Asset.pdf',
      filename: doc.filename || 'Uploaded-Asset.pdf',
      revision: doc.revision || 'REV-E',
      statusBadge: 'Approved for Construction',
      statusType: 'approved',
      version: 'v1.0',
      updatedAt: 'Updated Just now',
      author: 'Marcus V.',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivoSuEV3-t_NBTQuVpDYxw96iS-Q0Ga730bYqCzNKZbItIp2UGUswa9suH-oQd85nl0yQ95xzFu041AdJ3pptm4wU6tbVprPUEHQCOpUfi7yMadwJM5Sziw1yjtgHIRyIwNuJvV3l_N5yl12StfH8PhcA7g-PImkajhxFSMCkc9lsa8qq6sCip3bUGK9SYopQ84wAiFfaPhO5DYl-FKKWy8heAjhLPRXh07pcDf4JP82MUQ-05WXjmA',
      fileType: (doc.fileType || 'PDF') as any,
    };
  },

  async getCurrentUser(): Promise<User> {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (e) {
      console.warn('API /api/auth/me failed', e);
    }
    return initialUsers[0];
  },

  async login(email: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (e) {
      console.warn('API login failed', e);
    }
    return initialUsers.find((u) => u.email === email) || initialUsers[0];
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('API logout failed', e);
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        return data.users;
      }
    } catch (e) {
      console.warn('API /api/users failed', e);
    }
    return initialUsers;
  },

  async switchUser(userId: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (e) {
      console.warn('API switch user failed', e);
    }
    return initialUsers.find((u) => u.id === userId) || initialUsers[0];
  },
};
