// Server data store for Chronos Project Timeline Tracking

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
  startDay: number; // 0-based offset from start of window
  durationDays: number;
  delayDays: number;
  isCriticalPath: boolean;
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
  startDateFormatted: string;
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
  token?: string;
}

export const initialProjects: Project[] = [
  {
    id: 'APX-7029',
    name: 'Apex Bridge & Infrastructure Phase 2',
    code: 'APX-7029',
    sector: 'Sector 4 Expansion',
    status: 'On Track',
    sprint: 'Sprint 14',
    velocity: 42,
    healthPercentage: 74,
    targetCompletion: 'Nov 28, 2025',
    daysDelta: '+4 Days Ahead',
    activeLoad: 12,
    totalTasks: 48,
    ongoingTasks: 48,
    completedMilestones: 142,
    criticalRisks: 3,
  },
  {
    id: 'HBR-1044',
    name: 'Harbor Deepwater Pier & Quay Expansion',
    code: 'HBR-1044',
    sector: 'Maritime Berth 9',
    status: 'Delayed',
    sprint: 'Sprint 8',
    velocity: 36,
    healthPercentage: 62,
    targetCompletion: 'Jan 15, 2026',
    daysDelta: '-6 Days Slip',
    activeLoad: 8,
    totalTasks: 34,
    ongoingTasks: 22,
    completedMilestones: 88,
    criticalRisks: 4,
  },
  {
    id: 'MET-3021',
    name: 'Metro Transit Skyrail Pylon Corridor',
    code: 'MET-3021',
    sector: 'Zone 7 Viaduct',
    status: 'On Track',
    sprint: 'Sprint 20',
    velocity: 51,
    healthPercentage: 89,
    targetCompletion: 'Dec 12, 2025',
    daysDelta: '+8 Days Ahead',
    activeLoad: 15,
    totalTasks: 62,
    ongoingTasks: 39,
    completedMilestones: 210,
    criticalRisks: 1,
  },
];

export const initialMilestones: Milestone[] = [
  { id: 'm1', step: 1, name: 'Site Prep & Earthwork', status: 'Completed', progressPercentage: 100, targetDate: 'Aug 15, 2025' },
  { id: 'm2', step: 2, name: 'Subsurface Foundation', status: 'Completed', progressPercentage: 100, targetDate: 'Sep 30, 2025' },
  { id: 'm3', step: 3, name: 'Structural Core & Pylons', status: 'Active', progressPercentage: 65, targetDate: 'Oct 28, 2025' },
  { id: 'm4', step: 4, name: 'MEP Conduit Routing', status: 'Pending', progressPercentage: 0, targetDate: 'Nov 12, 2025' },
  { id: 'm5', step: 5, name: 'Load Stress & Handover', status: 'Pending', progressPercentage: 0, targetDate: 'Nov 28, 2025' },
];

export const initialGanttTasks: GanttTask[] = [
  {
    id: 't1',
    wbsId: 'WBS-101-A',
    name: 'Foundation',
    subtitle: 'Sector A Piling',
    status: 'Complete',
    progress: 100,
    startDay: 0,
    durationDays: 5,
    delayDays: 0,
    isCriticalPath: false,
    startDateFormatted: 'Oct 14, 2025',
    assignee: {
      name: 'Marcus Chen',
      role: 'Lead Site Engineer',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1JNFBb0ZztNdIih9s2tuOAXHZWHvS3RmX-l7mgmPmeY3jLPszSPJfr4q3OYx50GWqpmRpDSUAoIaHa2WDLhsnJQ0xbovX62wUVMK7Z9-287OXS-I95Jx8qSX2jCwCKO194TftKFdUJoeg45tWHm4RBRU4yiG1Gya_IuCAoD_ffR-049ZQGktg-C2WNgCKRgg8z_WCGIEk3OYyQ7ZudB-rAK9rxIoWzv0_e1BqTsF2NdDj9v2sBL3E8w',
      location: 'Site HQ (Deck 1)',
      channel: 'Radio Ch. 1',
      phone: '+1 (555) 349-2910',
    },
  },
  {
    id: 't2',
    wbsId: 'WBS-108-C',
    name: 'Steel Frame',
    subtitle: 'Truss Grid 1-8',
    status: 'Active',
    progress: 70,
    startDay: 3,
    durationDays: 7,
    delayDays: 0,
    isCriticalPath: true,
    startDateFormatted: 'Oct 17, 2025',
    assignee: {
      name: 'Alex Voron',
      role: 'Steel Truss Supervisor',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO_2I8kTW17MPZwWoeor_jrvc5CNh7kdAPad_A9-v3uAHSE9Qid_QUfACP-A7ul-GdEXa_Wc7BfD3mAIKOXeSTv534bZ2U8ibVtl4D2llm_xi_YI8r1_p6DUCJA72lF4ziXl2O_lqE7R7jvPFBw4PrGU_DpXivLaJCjqUbZn6gEmE9XN4JuAijXC0p2xw77GHcfNARud2LCagR_tOXyMQqDQWtC2M0zTPbTVf29tby3YpfRCroF-eTsg',
      location: 'Tower Crane 2 Cab',
      channel: 'Radio Ch. 3',
      phone: '+1 (555) 782-1140',
    },
    upstreamDependency: {
      name: 'Sector A Sub-Piles',
      type: 'Finish-to-Start (FS + 0d)',
      locked: true,
    },
  },
  {
    id: 't3',
    wbsId: 'WBS-204-B',
    name: 'Reinforced Decking (Sector B)',
    subtitle: 'Level 3 Concrete Pour',
    status: 'Delayed',
    progress: 25,
    startDay: 8,
    durationDays: 7, // 4d base + 3d delay
    delayDays: 3,
    isCriticalPath: true,
    startDateFormatted: 'Oct 22, 2025',
    assignee: {
      name: 'Elena Rostova',
      role: 'Structural Lead · Sector B Site',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IZIfLuXceh1hVZytTzdk2UyDeTgfNZ3gad8BLn41z68KBScSWVYmw4sWFPnCe3AtrNhwPg0KtnIYoAg5PYI03FnXROFe_3gridOOcsQdmTRblhyd5Ajr4fzApUcTIQZi6o6VQydfpt8t688TdhUGHKc6jVIMhni-tc2NmF7YlfL2N6W4v-85s2Tnb571Lzslr9-rDBU7rCue_5OHYjrM5X1_QuekDUzjF_c_fpl0YL_qNYdS_qPT9Q',
      location: 'On Site (Radio Ch. 4)',
      channel: 'Radio Ch. 4',
      phone: '+1 (555) 912-4040',
    },
    upstreamDependency: {
      name: 'Preceded by Steel Framework',
      type: 'Finish-to-Start (FS + 0d)',
      locked: true,
    },
    mitigationLog: {
      text: 'Alternative rebar supplier contracted for expedited delivery. Site inspection slated for Friday morning.',
      loggedAt: 'Logged 42 mins ago by Logistics Office',
      author: 'Logistics Office',
    },
  },
  {
    id: 't4',
    wbsId: 'WBS-300-M',
    name: 'Structural Signoff Gate',
    subtitle: 'Structural Gate Milestone',
    status: 'Milestone',
    progress: 0,
    startDay: 11,
    durationDays: 1,
    delayDays: 0,
    isCriticalPath: true,
    startDateFormatted: 'Oct 25, 2025',
    assignee: {
      name: 'Sarah Jenkins',
      role: 'MEP Compliance Lead',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARayxD5sTJDXthFtrBgWmIMZxnb1TIw3oQRZlIx2_30_pGecgsfliqwuiaWwDnwUhjWItdepHTVg6tDah2wK_zVEYsfy3ysdXmyWKI3jo7Tjn7dfZ-PRuyS7B5RaUPC00CLiH3yxfejTr1a3efXZCo6Wm05AY9E1sWfQguKAsBR9ZK3VkVuyurmco9DvbWZETe2a1dSA7EefobUolVvcTYc-Md0mXdyii8QOzT7cXyoxcTJdN9afnqSw',
      location: 'Bureau Central Office',
      channel: 'Radio Ch. 2',
      phone: '+1 (555) 441-8930',
    },
  },
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    code: 'ACT-442',
    title: 'Substation Electrical Wiring',
    scope: 'Conduit pull & terminal bus',
    status: 'ongoing',
    progress: 62,
    dueDate: 'Oct 26',
    statusPill: 'On Pace',
    assignedTeam: 'Electrical Squad',
    teamMembers: [
      { initials: 'EK', bg: 'bg-[#0f2744]' },
      { initials: 'DR', bg: 'bg-[#216293]' },
      { initials: '+3', bg: 'bg-[#d3e4fe]' },
    ],
  },
  {
    id: 'act-2',
    code: 'ACT-389',
    title: 'Curtain Wall Glazing L4-L6',
    scope: 'Bracket mounting & insulated glass',
    status: 'ongoing',
    progress: 40,
    expectedProgress: 55,
    dueDate: 'Oct 29',
    delayWarning: '+1 Day behind target',
    statusPill: 'Delayed',
    assignedTeam: 'Facade Team',
    lead: {
      name: "Liam O'Connor",
      role: 'Lead Facade Contractor',
      initials: 'LO',
    },
  },
  {
    id: 'act-3',
    code: 'ACT-510',
    title: 'Fire Suppression Pipeline Pressure Test',
    scope: 'Hydrostatic pressurization testing',
    status: 'pending',
    progress: 0,
    dueDate: 'In 3 days',
    statusPill: 'Queued',
    assignedTeam: 'Safety & MEP Bureau',
    prerequisite: {
      text: 'Requires 100% Piping Rough-in signoff on Floors 1-5 before hydrostatic pressurization.',
      progress: 88,
    },
  },
  {
    id: 'act-4',
    code: 'ACT-102',
    title: 'Subgrade Compaction & Soil Stabilization',
    scope: 'Geological compaction and density core test',
    status: 'completed',
    progress: 100,
    dueDate: 'Oct 16',
    statusPill: 'Completed',
    assignedTeam: 'GeoTech Bureau',
    signoff: {
      certifiedBy: 'Inspected & Sealed by Chief GeoTech Eng',
      badge: 'SEALED',
      fileUrl: '/docs/signoff-subgrade-102.pdf',
    },
  },
  {
    id: 'act-5',
    code: 'ACT-209',
    title: 'HVAC Duct Inspection & Air Balancing',
    scope: 'Tunnel Section B-12 Pressure Relief',
    status: 'ongoing',
    progress: 52,
    dueDate: 'Oct 25',
    delayWarning: 'Weather Delay risk 1d (Forecast: Heavy Rain)',
    statusPill: 'Compliance',
    assignedTeam: 'HVAC Specialists',
    lead: {
      name: 'Sarah Jenkins',
      role: 'MEP Compliance Lead',
      initials: 'SJ',
    },
  },
  {
    id: 'act-6',
    code: 'ACT-312',
    title: 'High-Yield Concrete Pour Sector 4B',
    scope: 'Spec: High-Yield Hydro-Cure Mix 09',
    status: 'pending',
    progress: 15,
    dueDate: 'Tomorrow, 07:00',
    statusPill: 'High Priority',
    assignedTeam: 'Civil Pouring Crew',
    lead: {
      name: 'Marcus Chen',
      role: 'Lead Site Engineer',
      initials: 'MC',
    },
  },
];

export const initialDelayAlerts = [
  {
    id: 'alert-1',
    title: 'Excavation Sector C',
    reason: 'Flash rain flooding • Runoff drainage active',
    slip: '+2d slip',
    impact: 'Schedule impacts on secondary critical path',
  },
  {
    id: 'alert-2',
    title: 'Transformer Delivery',
    reason: 'Port clearance customs hold • Substation B impact',
    slip: '+4d slip',
    impact: 'Substation energization gate delayed',
  },
];

export const initialFeed: FeedUpdate[] = [
  {
    id: 'f1',
    author: {
      name: 'Marcus Chen',
      role: 'QA Lead',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYr2nT8tuVObUh5LzyZaAPFdyTf67fezQAxZjfnAmMRp3JUHdKaz6gMb3d-CmGpC_ARwptP-lAvw3Gfv_C5NBTFTU08gUAiMh0DIGiCY7nIRJN7S01jxAsyhbKSf25gDmrGK_SlEF7RgPYlS23HR8sdnsDJMcm6C2IuX96aicYZJSd-_uTBKLFKsGttrNd_uuuxiHIhRFI0FJq2Fkrvc4ikBG4e1y7mdhhUmP2a_HvKp6NSolks-SkKw',
      verified: true,
    },
    timestamp: 'Today • 09:30 AM',
    content: 'Completed ultrasound testing on weld joints #101 to #140. All passed QA penetration and structural density standards.',
    badge: 'Verified QA',
    badgeColor: 'text-[#216293] bg-[#e5eeff]',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlVFqy0w7AQ_Nh1XslPpOaikxNSArx-hoj5RIoLGWHNw0w8ERvWFM28p-dW6pOMTC3LNYfLVbkT-ThLCDSzqEmDHmRgm5xfYPtkhIJ1qyqqfiw9Khvd7ByJfreb15W_cHzFuFxFZnEp-pEo2vDZ9eCtJe-X4v7VHTG5cb5Ltcqa4VRwEX19sDwetEdDCMxh489h4omO5PUZaHk8p7pey1rLHLZGjj6ApODnsPQb7iDAiSxsWTfAzMzpw',
        filename: 'Joint-118-NDT.raw',
        alt: 'Ultrasound nondestructive weld test on steel girder',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQOaxQN0kDouLhMGAuFLSZCZR-0VFuAqmNcjimtb1E29Vo3MnK51OIuKaLO2b6T-NpuvUpY7uNF9N3asFJg0KVdBNmthJgOQA-SLyU2SYVRevsxQ4YpADzL1KtbIUdm0lImYW-652aMGqjHng64nPIUIkQNoSrXW7EhCduHdI_ijoFTI2eu050AGTmkltnxx6vDBKIxf-HlD28kyPJa7DoZ9M1GHRW5Gc6xFuTIn1Te7_4CupFdNf-uA',
        filename: 'Spectra-Beam-L3.png',
        alt: 'Frequency inspection monitor readout',
      },
    ],
    systemTag: 'Synced to Master Gantt',
    likes: 4,
    commentsCount: 1,
  },
  {
    id: 'f2',
    author: {
      name: 'Sarah Jenkins',
      role: 'Fleet Eng',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjeHwrDY5w2-7ysVU1MUI1IhgAjcmzPQQI8VTz1Mat1pTIanOIz1NPH9mlzeQk6pNRyxKljMcY6AGL42ocjIwWCHHyXaVCs2HeobtkFLlul7aOHsuL9vcsdLvvsogGMPFJQJhk9Q63KeMWnCtDmH0oTszTp14FXBDv1tYcPoxy5vMbyAQHv_7wszLjH5-xQs6NhotwA-oMVp6TG5bTizENQH9JyXz_rWq8mBQyNDwqOR1aFa0U-wyWqw',
      verified: false,
    },
    timestamp: 'Yesterday • 04:15 PM',
    content: 'Tower Crane 2 scheduled hoist line & bearing lubrication completed 2 hours ahead of schedule. Full load cell calibration logged.',
    badge: 'Equipment',
    badgeColor: 'text-[#0b1c30] bg-[#dce9ff]',
    systemTag: 'Clear for 50-ton heavy lifts • TC-02 ONLINE',
    likes: 7,
    commentsCount: 2,
  },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    category: 'drawings',
    title: 'DWG-402-Structural-Elevation-Rev-D.pdf',
    filename: 'DWG-402-Structural-Elevation-Rev-D.pdf',
    revision: 'REV-D',
    statusBadge: 'Approved for Construction',
    statusType: 'approved',
    version: 'v4.2',
    updatedAt: 'Updated Oct 18 by Lead Arch Marcus V.',
    author: 'Marcus V.',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivoSuEV3-t_NBTQuVpDYxw96iS-Q0Ga730bYqCzNKZbItIp2UGUswa9suH-oQd85nl0yQ95xzFu041AdJ3pptm4wU6tbVprPUEHQCOpUfi7yMadwJM5Sziw1yjtgHIRyIwNuJvV3l_N5yl12StfH8PhcA7g-PImkajhxFSMCkc9lsa8qq6sCip3bUGK9SYopQ84wAiFfaPhO5DYl-FKKWy8heAjhLPRXh07pcDf4JP82MUQ-05WXjmA',
    fileType: 'PDF',
    diffNotes: {
      additions: '+14 shear pins',
      removals: '-2 portal frames',
      hash: '8f4a2b',
    },
  },
  {
    id: 'doc-2',
    category: 'drawings',
    title: 'MEP-Hydraulic-Riser-Diagram-Rev-B.dwg',
    filename: 'MEP-Hydraulic-Riser-Diagram-Rev-B.dwg',
    revision: 'REV-B',
    statusBadge: 'Pending Engineering Review',
    statusType: 'review',
    version: 'v2.1',
    updatedAt: 'Uploaded 3 hrs ago • Assigned to Sarah T.',
    author: 'Sarah T.',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATO0wiYaajhBYZQtoBRMi0yjefmDSiVWWTAPEFcpbI9RFMpDCvYH8j-LoxEkLP_xZldx6MK4KF7M8zcqP2PG2o9CEg7SqVTAF70bAAjWJ02NcDoH4KhgEm-zTRhCUateaUzurhGbLp7rv__ppRNTM1jjBh8Nalw_4rHrUimhQYXuzssjQR9x8xJCQM5l5oCAoJeD5s1OclqxsY9j6iMXaUBzwOEx3C0xevsu_81TJNFfSjRGtXB3JayA',
    fileType: 'DWG',
    slaRemaining: 'SLA Deadline: 18h remaining',
  },
  {
    id: 'doc-3',
    category: 'photos',
    title: 'Foundation Rebar Inspection',
    filename: 'Rebar-Sector-4B-1019.jpg',
    revision: 'INSP-29',
    statusBadge: 'Passed Oct 19',
    statusType: 'approved',
    version: 'v1.0',
    updatedAt: 'Timestamp: 2023-10-19 11:42:09 EST',
    author: 'Dave Chen (QC Lead)',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_x9u2rxSqWfmDPuKfPafJCdm5RqH1EdqFzPRHNOtgNg3DJWuF9KLEr2_pBRhPuVm1Tcv3GUgKK65Ts44YK4QFAmOzHWXW35QOkD4OmyydSJ9gs8_g_VL3wTozvigMjqN_ZVq82OTQ2qjAY5GYyyE07bYXQMvoPJVm7jeTVvpTXHeHVQXxz5Kh6SsXiWXKUmmG_A2hvNI-MhjeixuYYV69rGHCvqLiFgKlvqtIe8_DKAUQYkWqx2AgRQ',
    fileType: 'JPG',
    sectorTag: 'Grid Sector 4B',
    inspector: 'Dave Chen (QC Lead)',
    metricsTag: '4 Specs Linked',
  },
  {
    id: 'doc-4',
    category: 'photos',
    title: 'Concrete Batch Pour #12 Testing',
    filename: 'Slump-Cone-Batch-12.jpg',
    revision: 'BATCH-C40',
    statusBadge: 'Slump: 120mm OK',
    statusType: 'approved',
    version: 'v1.0',
    updatedAt: 'Timestamp: 2023-10-19 14:15:33 EST',
    author: 'Elena Ramos (Civil Eng)',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwyazd959ongBo69FtKeLjQadMfcVoO2D__SFEe2f9XAPH4uy-bHdAlK0jyjR_I9FyDWjxNzjFznBTr8gZPM5vJTgpMjS_laS5WeUQkrdo8dZdagEZy5XT6qClEAbGlTiS--MEzvboz8rQFwhQjeIL191XVszTQvzX7VSzjXeHtIkNEVFmlvRTQRZQpYe3yMVlKg73D11ggtriNMCpHLEofE0ryPhqiCecQex5BjjglacWTM5Ut8KhyA',
    fileType: 'JPG',
    sectorTag: 'Pour Zone 2A',
    inspector: 'Elena Ramos (Civil Eng)',
    metricsTag: 'Batch #C40-99',
  },
];

export const initialUsers: User[] = [
  {
    id: 'u-1',
    email: 'marcus.chen@chronos.eng',
    name: 'Marcus Chen',
    role: 'Lead Engineer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkrLFkuOQCOzCOkWORpgfZL9MwVqqgnqeSiSE2LWKwx_ZVnQjCYjY5ROTGzEn_1JBaeFl5UBcwX-LHkXbOimECVDL4iwYRwk8y3ZilotWRKVk83EK3kuCJp2Y2x0iaNPDrCtSnS8mdFwqF-90Z1KgKyPm70Fm0gNXBoPjVptHavKOcZQzrYN2J-5Cdy_PskuMWwPwpdu-1mL-NxAeq17yzO--31XrGda4kxnhHbUU8R_2nWnGSzqQkZg',
    permissions: 'Manager View • Full Edit Access Enabled',
  },
  {
    id: 'u-2',
    email: 'elena.rostova@chronos.eng',
    name: 'Elena Rostova',
    role: 'Project Manager',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IZIfLuXceh1hVZytTzdk2UyDeTgfNZ3gad8BLn41z68KBScSWVYmw4sWFPnCe3AtrNhwPg0KtnIYoAg5PYI03FnXROFe_3gridOOcsQdmTRblhyd5Ajr4fzApUcTIQZi6o6VQydfpt8t688TdhUGHKc6jVIMhni-tc2NmF7YlfL2N6W4v-85s2Tnb571Lzslr9-rDBU7rCue_5OHYjrM5X1_QuekDUzjF_c_fpl0YL_qNYdS_qPT9Q',
    permissions: 'Manager View • Full Edit Access Enabled',
  },
  {
    id: 'u-3',
    email: 'sarah.jenkins@chronos.eng',
    name: 'Sarah Jenkins',
    role: 'Lead Inspector',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARayxD5sTJDXthFtrBgWmIMZxnb1TIw3oQRZlIx2_30_pGecgsfliqwuiaWwDnwUhjWItdepHTVg6tDah2wK_zVEYsfy3ysdXmyWKI3jo7Tjn7dfZ-PRuyS7B5RaUPC00CLiH3yxfejTr1a3efXZCo6Wm05AY9E1sWfQguKAsBR9ZK3VkVuyurmco9DvbWZETe2a1dSA7EefobUolVvcTYc-Md0mXdyii8QOzT7cXyoxcTJdN9afnqSw',
    permissions: 'Inspector View • QA & Field Log Signoff',
  },
  {
    id: 'u-4',
    email: 'liam.oconnor@facadeworks.com',
    name: "Liam O'Connor",
    role: 'Contractor',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1JNFBb0ZztNdIih9s2tuOAXHZWHvS3RmX-l7mgmPmeY3jLPszSPJfr4q3OYx50GWqpmRpDSUAoIaHa2WDLhsnJQ0xbovX62wUVMK7Z9-287OXS-I95Jx8qSX2jCwCKO194TftKFdUJoeg45tWHm4RBRU4yiG1Gya_IuCAoD_ffR-049ZQGktg-C2WNgCKRgg8z_WCGIEk3OYyQ7ZudB-rAK9rxIoWzv0_e1BqTsF2NdDj9v2sBL3E8w',
    permissions: 'Contractor View • Field Status Log Only',
  },
];
