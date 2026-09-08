import React, { useState } from 'react';
import { User, NavTab } from '../types.ts';
import { Bell, ShieldCheck, LogOut, ChevronDown, Check, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  users: User[];
  unreadAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onSwitchUser,
  users,
  unreadAlertCount,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#c4c6ce]/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0f2744] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-[#89ceff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="16" y2="6" />
                <circle cx="17" cy="6" r="2" fill="#89ceff" />
                <line x1="4" y1="12" x2="19" y2="12" />
                <circle cx="20" cy="12" r="2" fill="#89ceff" />
                <line x1="4" y1="18" x2="12" y2="18" />
                <circle cx="13" cy="18" r="2" fill="#89ceff" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[15px] text-[#0b1c30] tracking-tight group-hover:text-[#216293] transition-colors">
                  Chronos
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#e5eeff] text-[#216293] rounded">
                  Timeline
                </span>
              </div>
              <span className="text-[12px] text-[#44474d] capitalize truncate font-medium">
                {activeTab === 'media-docs' ? 'Media & CAD Docs' : activeTab}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#0f2744] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[#0f2744] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'activities'
                  ? 'bg-[#0f2744] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab('media-docs')}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === 'media-docs'
                  ? 'bg-[#0f2744] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              Media/Docs
            </button>
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role Badge */}
          {currentUser && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase px-2 py-0.5 bg-[#e5eeff] text-[#216293] rounded border border-[#d3e4fe]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#216293]" />
              {currentUser.role}
            </span>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center text-[#44474d] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-[#f8f9ff] animate-pulse" />
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#c4c6ce]/40 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                  <span className="font-bold text-[13px] text-[#0b1c30]">Critical Alerts</span>
                  <span className="font-mono text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.5 rounded">
                    {unreadAlertCount} Pending
                  </span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div className="p-2 bg-[#ffdad6]/60 rounded-lg text-[#0b1c30]">
                    <div className="font-bold text-[#ba1a1a] flex items-center justify-between">
                      <span>Excavation Sector C</span>
                      <span className="font-mono">+2d slip</span>
                    </div>
                    <p className="text-[11px] text-[#44474d] mt-0.5">Flash rain flooding • Runoff drainage active</p>
                  </div>
                  <div className="p-2 bg-[#ffdad6]/60 rounded-lg text-[#0b1c30]">
                    <div className="font-bold text-[#ba1a1a] flex items-center justify-between">
                      <span>Transformer Delivery</span>
                      <span className="font-mono">+4d slip</span>
                    </div>
                    <p className="text-[11px] text-[#44474d] mt-0.5">Port customs hold • Substation B impact</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('activities');
                  }}
                  className="w-full mt-1 py-1.5 text-center text-xs font-semibold text-[#216293] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg transition-colors"
                >
                  View Schedule Mitigation
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Switcher */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#216293]/30 transition-all focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c4c6ce]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#44474d]" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#c4c6ce]/40 py-2 z-50">
                  <div className="px-3 py-2 border-b border-[#eff4ff]">
                    <div className="font-bold text-[13px] text-[#0b1c30] truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-[#44474d] truncate">{currentUser.email}</div>
                    <div className="font-mono text-[10px] text-[#216293] mt-1 font-semibold">
                      {currentUser.role}
                    </div>
                  </div>

                  {/* Switch Profile Quick Tool */}
                  <div className="px-3 py-1 text-[10px] font-bold text-[#74777e] uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <div className="space-y-0.5 px-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#eff4ff] text-[#0b1c30] font-semibold'
                            : 'text-[#44474d] hover:bg-[#f8f9ff]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="truncate">{u.name}</span>
                        </div>
                        {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-[#216293]" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 pt-1 border-t border-[#eff4ff] px-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f2744] text-white rounded-lg text-xs font-semibold hover:bg-[#216293] transition-colors shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
