import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

interface NavigationHistory {
  path: string;
  label: string;
}

export default function SideMenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory[]>([
    { path: '/dashboard', label: 'الرئيسية' },
  ]);

  // Track navigation
  useEffect(() => {
    if (location !== navigationHistory[navigationHistory.length - 1]?.path) {
      setNavigationHistory([...navigationHistory, { path: location, label: getPageLabel(location) }]);
    }
  }, [location]);

  const getPageLabel = (path: string): string => {
    const labels: Record<string, string> = {
      '/dashboard': 'الرئيسية',
      '/notion': 'قالب Notion',
      '/prompts': 'مكتبة الأوامر',
      '/ideas': 'مركز الأفكار',
      '/resources': 'الموارد',
      '/profile': 'ملفي الشخصي',
      '/settings': 'الإعدادات',
      '/help': 'المساعدة والدعم',
    };
    return labels[path] || 'صفحة';
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(newHistory);
      setLocation(newHistory[newHistory.length - 1].path);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/');
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: Home,
      label: 'الرئيسية',
      path: '/dashboard',
      color: 'text-cyan-400',
    },
    {
      icon: User,
      label: 'ملفي الشخصي',
      path: '/profile',
      color: 'text-orange-400',
    },
    {
      icon: Settings,
      label: 'الإعدادات',
      path: '/settings',
      color: 'text-purple-400',
    },
    {
      icon: HelpCircle,
      label: 'المساعدة والدعم',
      path: '/help',
      color: 'text-green-400',
    },
  ];

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-cyan-400" />
        ) : (
          <Menu className="w-6 h-6 text-cyan-400" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-64 z-40
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
          border-l border-slate-800/50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="border-b border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">القائمة</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {user && (
            <div className="text-sm">
              <p className="text-gray-400">مرحباً</p>
              <p className="text-white font-semibold truncate">{user.name}</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={navigationHistory.length <= 1}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200
              ${
                navigationHistory.length <= 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-800/50 text-gray-300 hover:text-cyan-400'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>رجوع</span>
          </button>

          {/* Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? `bg-gradient-to-r from-${item.color}/20 to-transparent border border-${item.color}/30 ${item.color}`
                      : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800/50 p-4 space-y-2">
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </Button>

          {/* Status */}
          <div className="text-xs text-gray-500 text-center pt-2">
            <p>الإصدار 1.0</p>
            <p>جميع الحقوق محفوظة © 2026</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {navigationHistory.length > 1 && (
        <div className="fixed top-20 right-4 z-30 hidden md:block">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
            {navigationHistory.slice(-2).map((item, index) => (
              <div key={item.path} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-600">/</span>}
                <button
                  onClick={() => {
                    if (index === 0) {
                      handleBack();
                    }
                  }}
                  className={`text-xs font-medium transition-colors ${
                    index === navigationHistory.length - 2
                      ? 'text-gray-500 hover:text-gray-400'
                      : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
