/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { Business, Advert, Category, PricingPackage, PaymentRecord, User } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { BusinessesView } from './components/views/BusinessesView';
import { AdvertsView } from './components/views/AdvertsView';
import { CategoriesView } from './components/views/CategoriesView';
import { PricingView } from './components/views/PricingView';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { AdvertDetailModal } from './components/AdvertDetailModal';
import { PaystackPaymentModal } from './components/PaystackPaymentModal';
import { AuthModal } from './components/AuthModal';
import { ContactModal } from './components/ContactModal';
import { PolicyModal } from './components/PolicyModals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(storageService.getCurrentUser());
  const [settings, setSettings] = useState(storageService.getSiteSettings());

  // Data states
  const [businesses, setBusinesses] = useState<Business[]>(storageService.getBusinesses());
  const [adverts, setAdverts] = useState<Advert[]>(storageService.getAdverts());
  const [categories, setCategories] = useState<Category[]>(storageService.getCategories());
  const [packages, setPackages] = useState<PricingPackage[]>(storageService.getPackages());

  // Search parameters between views
  const [searchParams, setSearchParams] = useState<{
    keyword: string;
    category: string;
    state: string;
  }>({
    keyword: '',
    category: '',
    state: ''
  });

  // Modals
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | null>(null);

  // Paystack Checkout Modal state
  const [checkoutPackage, setCheckoutPackage] = useState<PricingPackage | null>(null);
  const [checkoutTarget, setCheckoutTarget] = useState<{
    id: string;
    type: 'listing' | 'advert' | 'banner';
    title: string;
  }>({ id: '', type: 'listing', title: '' });

  const refreshAllData = () => {
    setBusinesses(storageService.getBusinesses());
    setAdverts(storageService.getAdverts());
    setCategories(storageService.getCategories());
    setPackages(storageService.getPackages());
    setSettings(storageService.getSiteSettings());
    setCurrentUser(storageService.getCurrentUser());
  };

  useEffect(() => {
    refreshAllData();
  }, [currentTab]);

  // Handle hero search
  const handleHeroSearch = (params: { keyword: string; category: string; state: string }) => {
    setSearchParams(params);
    setCurrentTab('businesses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category card click
  const handleCategorySelect = (categoryName: string) => {
    setSearchParams({ keyword: '', category: categoryName, state: '' });
    setCurrentTab('businesses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdverts = (categoryName: string) => {
    setSearchParams({ keyword: '', category: categoryName, state: '' });
    setCurrentTab('adverts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch checkout modal
  const handleInitiatePackageCheckout = (
    pkg: PricingPackage,
    itemId?: string,
    itemType?: 'listing' | 'advert' | 'banner',
    title?: string
  ) => {
    if (pkg.price === 0) {
      // Free listing
      if (!currentUser) {
        setAuthMode('register');
        setAuthModalOpen(true);
      } else {
        setCurrentTab('dashboard');
      }
      return;
    }

    if (!currentUser) {
      setAuthMode('register');
      setAuthModalOpen(true);
      return;
    }

    // Default to first user business/advert if not explicitly supplied
    const myBiz = businesses.filter((b) => b.user_id === currentUser.id)[0];
    const myAdv = adverts.filter((a) => a.user_id === currentUser.id)[0];

    const resolvedId = itemId || (pkg.type === 'listing' ? myBiz?.id : myAdv?.id) || `temp-${Date.now()}`;
    const resolvedType = itemType || (pkg.type === 'banner' ? 'banner' : pkg.type === 'listing' ? 'listing' : 'advert');
    const resolvedTitle = title || (pkg.type === 'listing' ? myBiz?.name || 'My Business Profile' : myAdv?.title || 'My Product Advert');

    setCheckoutPackage(pkg);
    setCheckoutTarget({
      id: resolvedId,
      type: resolvedType,
      title: resolvedTitle
    });
  };

  const handlePaymentSuccess = (_record: PaymentRecord) => {
    refreshAllData();
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e0f2fe] text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        settings={settings}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            categories={categories}
            businesses={businesses.filter((b) => b.status === 'approved')}
            adverts={adverts.filter((a) => a.status === 'approved')}
            onSelectBusiness={(b) => setSelectedBusiness(b)}
            onSelectAdvert={(a) => setSelectedAdvert(a)}
            onSelectCategory={handleCategorySelect}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={(mode) => {
              setAuthMode(mode || 'register');
              setAuthModalOpen(true);
            }}
            onSearch={handleHeroSearch}
          />
        )}

        {currentTab === 'businesses' && (
          <BusinessesView
            businesses={businesses}
            categories={categories}
            initialCategory={searchParams.category}
            initialKeyword={searchParams.keyword}
            initialState={searchParams.state}
            onSelectBusiness={(b) => setSelectedBusiness(b)}
            onOpenAuth={(mode) => {
              setAuthMode(mode || 'register');
              setAuthModalOpen(true);
            }}
          />
        )}

        {currentTab === 'adverts' && (
          <AdvertsView
            adverts={adverts}
            categories={categories}
            initialCategory={searchParams.category}
            initialKeyword={searchParams.keyword}
            onSelectAdvert={(a) => setSelectedAdvert(a)}
            onOpenAuth={(mode) => {
              setAuthMode(mode || 'register');
              setAuthModalOpen(true);
            }}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesView
            categories={categories}
            onSelectCategory={handleCategorySelect}
            onNavigateToAdverts={handleNavigateToAdverts}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingView
            packages={packages}
            onSelectPackage={(pkg) => handleInitiatePackageCheckout(pkg)}
          />
        )}

        {currentTab === 'dashboard' && currentUser && (
          <UserDashboard
            user={currentUser}
            onUpgradePackage={(pkg, itemId, itemType, title) =>
              handleInitiatePackageCheckout(pkg, itemId, itemType, title)
            }
            onViewBusiness={(b) => setSelectedBusiness(b)}
            onViewAdvert={(a) => setSelectedAdvert(a)}
          />
        )}

        {currentTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard
            onViewBusiness={(b) => setSelectedBusiness(b)}
            onViewAdvert={(a) => setSelectedAdvert(a)}
          />
        )}
      </main>

      {/* Website Footer */}
      <Footer
        settings={settings}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicy={(type) => setActivePolicy(type)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setAuthModalOpen(true);
        }}
      />

      {/* Public Business Profile Modal */}
      <BusinessProfileModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        onSelectBusiness={(b) => setSelectedBusiness(b)}
      />

      {/* Public Advert Detail Modal */}
      <AdvertDetailModal
        advert={selectedAdvert}
        onClose={() => setSelectedAdvert(null)}
        onSelectAdvert={(a) => setSelectedAdvert(a)}
      />

      {/* Paystack Payment Checkout Modal */}
      <PaystackPaymentModal
        packageItem={checkoutPackage}
        itemId={checkoutTarget.id}
        itemType={checkoutTarget.type}
        itemTitle={checkoutTarget.title}
        onClose={() => setCheckoutPackage(null)}
        onSuccess={handlePaymentSuccess}
      />

      {/* User Login & Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />

      {/* Contact & Support Desk Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Terms, Privacy, and Refund Policies */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
}
