export interface Project {
  id: string;
  name: string;
  code: string;
  sector: string;
  status: 'On Track' | 'Delayed' | 'Critical' | 'Completed';
  sprint: string;
  velocity: number;
  healthPercentage: number;
  targetCompletion: string;
  daysDelta: string;
  activeLoad: number;
  totalTasks: number;
  ongoingTasks: number;
  completedMilestones: number;
  criticalRisks: number;
}

export interface Milestone {
  id: string;
  step: number;
  name: string;
  status: 'Completed' | 'Active' | 'Pending';
  progressPercentage: number;
  targetDate: string;
}

export interface GanttTask {
  id: string;
  wbsId: string;
  name: string;
  subtitle: string;
  status: 'Complete' | 'Active' | 'Delayed' | 'Milestone';
  progress: number;
  startDay: number;
  durationDays: number;
  delayDays: number;
  isCriticalPath: boolean;
  startDateFormatted: string;
  assignee: {
    name: string;
    role: string;
    avatar: string;
    location: string;
    channel: string;
    phone: string;
  };
  upstreamDependency?: {
    name: string;
    type: string;
    locked: boolean;
  };
  mitigationLog?: {
    text: string;
    loggedAt: string;
    author: string;
  };
}

export interface Activity {
  id: string;
  code: string;
  title: string;
  scope: string;
  status: 'ongoing' | 'pending' | 'completed';
  progress: number;
  expectedProgress?: number;
  dueDate: string;
  delayWarning?: string;
  statusPill: string;
  assignedTeam: string;
  teamMembers?: { initials: string; bg: string }[];
  lead?: {
    name: string;
    role: string;
    initials: string;
  };
  prerequisite?: {
    text: string;
    progress: number;
  };
  signoff?: {
    certifiedBy: string;
    badge: string;
    fileUrl: string;
  };
}

export interface FeedUpdate {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: string;
  content: string;
  badge: string;
  badgeColor: string;
  images?: {
    url: string;
    filename: string;
    alt: string;
  }[];
  systemTag?: string;
  likes: number;
  commentsCount: number;
}

export interface DelayAlert {
  id: string;
  title: string;
  reason: string;
  slip: string;
  impact: string;
}

export interface DocumentItem {
  id: string;
  category: 'drawings' | 'photos' | 'logs';
  title: string;
  filename: string;
  revision: string;
  statusBadge: string;
  statusType: 'approved' | 'pending' | 'review';
  version: string;
  updatedAt: string;
  author: string;
  thumbnail: string;
  fileType: 'PDF' | 'DWG' | 'JPG' | 'PNG';
  diffNotes?: {
    additions: string;
    removals: string;
    hash: string;
  };
  slaRemaining?: string;
  sectorTag?: string;
  inspector?: string;
  metricsTag?: string;
  timestamp?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Lead Engineer' | 'Project Manager' | 'Lead Inspector' | 'Contractor';
  avatar: string;
  permissions: string;
}

export type NavTab = 'dashboard' | 'timeline' | 'activities' | 'media-docs' | 'login';
