import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'analyze', label: 'Analyze Email' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-[#E3E5DF] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand Lockup */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#456B55] rounded"
        >
          <div className="w-7 h-7 rounded bg-[#EDF2EE] border border-[#D2D5CD] flex items-center justify-center text-[#456B55]">
            <Shield className="w-4 h-4" strokeWidth={2} />
          </div>
          <span className="text-base font-semibold tracking-tight text-[#242824]">
            PhishGuard
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#F0F2ED] text-[#737873] border border-[#E3E5DF] ml-1">
            v1.0
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm py-1 font-medium transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-[#456B55] border-[#456B55] font-semibold'
                    : 'text-[#737873] border-transparent hover:text-[#242824]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded text-[#737873] hover:text-[#242824] hover:bg-[#F0F2ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#456B55]"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3E5DF] bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'text-[#456B55] bg-[#EDF2EE] font-semibold'
                    : 'text-[#737873] hover:text-[#242824] hover:bg-[#F7F7F4]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
