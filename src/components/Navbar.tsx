import React, { useState } from 'react';
import { User, SiteSettings } from '../types';
import { getWhatsAppInquiryUrl } from '../utils/formatters';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  settings: SiteSettings;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
  onLogout: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  settings,
  onOpenAuth,
  onLogout,
  onOpenContact
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'businesses', label: 'Find Businesses' },
    { id: 'adverts', label: 'Browse Adverts' },
    { id: 'categories', label: 'Categories' },
    { id: 'pricing', label: 'Pricing' }
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppDesk = () => {
    const url = getWhatsAppInquiryUrl(settings.contact_whatsapp, 'AHAVA DIGITAL HUB Support');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#e0f2fe]/95 backdrop-blur-md border-b border-sky-300 shadow-xs">
      {/* Announcement Bar */}
      {settings.show_announcement && settings.announcement_text && (
        <div className="bg-blue-950 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-2">
          <span>{settings.announcement_text}</span>
          <button
            onClick={handleWhatsAppDesk}
            className="underline text-sky-200 hover:text-white font-extrabold ml-2"
          >
            Chat With Us
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo Brand with Uploaded Picture */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/assets/aistudio/IMG_20261028_235227_fcd2bf8e.png"
              alt="AHAVA DIGITAL HUB"
              className="h-11 sm:h-14 w-auto object-contain group-hover:scale-102 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-xl tracking-tight text-blue-950 group-hover:text-sky-700 transition-colors">
                AHAVA DIGITAL HUB
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-700 font-extrabold hidden sm:block -mt-0.5">
                Connecting Businesses to More Customers
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black transition-all ${
                  currentTab === link.id
                    ? 'text-white bg-blue-950 shadow-xs'
                    : 'text-slate-800 hover:text-blue-950 hover:bg-sky-200/70'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Area (Auth, CTA, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-sky-300 hover:border-sky-400 bg-sky-100/90 transition-all text-xs font-black text-blue-950 shadow-xs"
                >
                  <span className="hidden sm:inline-block max-w-[120px] truncate">
                    {currentUser.full_name}
                  </span>
                  {currentUser.role === 'admin' ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-800 text-[10px] font-black uppercase">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-sky-200 border border-sky-300 text-blue-950 text-[10px] font-black uppercase">
                      Owner
                    </span>
                  )}
                  <span className="text-slate-600 text-[10px]">▼</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-sky-50 border border-sky-300 shadow-2xl py-2 z-50 text-xs animate-in fade-in">
                    <div className="px-4 py-2 border-b border-sky-200">
                      <p className="font-extrabold text-blue-950 truncate">{currentUser.full_name}</p>
                      <p className="text-[11px] text-slate-700 font-semibold truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-sky-200/70 font-extrabold text-blue-950 transition-colors"
                    >
                      {currentUser.role === 'admin' ? 'Admin Control Center' : 'My Business Dashboard'}
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-sky-200/70 font-extrabold text-slate-800 transition-colors"
                      >
                        View as Merchant
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-100 text-red-700 font-black border-t border-sky-200 mt-1 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-800 hover:text-blue-950 hover:bg-sky-200/80 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-2 rounded-xl text-xs font-black border border-sky-300 bg-sky-200 hover:bg-sky-300 text-blue-950 transition-all shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            {/* Prominent "Advertise Your Business" CTA Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth('register');
                } else {
                  handleNavClick('dashboard');
                }
              }}
              className="px-3.5 sm:px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              Advertise Your Business
            </button>

            {/* Mobile Menu Toggle Button (No icon, clean text) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3 py-2 rounded-xl border border-sky-300 bg-sky-200 hover:bg-sky-300 text-blue-950 font-black text-xs md:hidden transition-colors"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-sky-100 border-b border-sky-300 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-black text-sm ${
                currentTab === link.id
                  ? 'bg-blue-950 text-white'
                  : 'text-slate-900 hover:bg-sky-200'
              }`}
            >
              {link.label}
            </button>
          ))}

          {!currentUser ? (
            <div className="pt-3 border-t border-sky-300 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-xs font-black text-blue-950"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-950 text-white text-xs font-black"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-sky-300 space-y-2">
              <button
                onClick={() => {
                  handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard');
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-sky-200 text-blue-950 font-black text-xs"
              >
                Go to {currentUser.role === 'admin' ? 'Admin Center' : 'My Dashboard'}
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-black text-red-700"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-700 font-bold">
            <button onClick={onOpenContact} className="hover:text-blue-950">
              Contact Support
            </button>
            <button
              onClick={() => {
                handleNavClick('admin');
                setMobileMenuOpen(false);
              }}
              className="text-blue-950 hover:underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
