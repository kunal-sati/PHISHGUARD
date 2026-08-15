import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'analyze', label: 'Analyze Email' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e1416]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex justify-between items-center px-4 md:px-8 h-16">
      <div className="flex items-center gap-8">
        <div 
          className="font-mono text-xl md:text-2xl font-extrabold text-[#4cd7f6] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] tracking-wider cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          PHISHGUARD
        </div>
        
        <div className="hidden md:flex gap-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-mono text-xs md:text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#4cd7f6] border-b-2 border-[#4cd7f6] bg-white/5'
                    : 'text-slate-400 hover:text-[#4cd7f6] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>


      {/* Mobile nav buttons */}
      <div className="md:hidden flex gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`font-mono text-[11px] uppercase px-2 py-1 rounded ${
                isActive ? 'text-[#4cd7f6] bg-slate-800' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
