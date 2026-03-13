import { useState } from 'react';
import { Menu, X, LogOut, User, Shield, Users, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const roleConfig = {
  employee: { label: 'Employee', icon: User },
  manager: { label: 'Manager', icon: Shield },
  'front-desk': { label: 'Front Desk', icon: Users },
  'it-admin': { label: 'IT Administrator', icon: Settings }
};

const BoltLayout = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const config = roleConfig[user?.role] || roleConfig.employee;
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-slate-100">VMS</span>
              </div>
              <div className="hidden md:block md:ml-6">
                <div className="text-sm text-gray-600 dark:text-slate-300">{subtitle || title}</div>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                <RoleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-slate-300">{user?.name}</div>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              <RoleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{config.label}</span>
            </div>
            <div className="px-3 py-1 text-sm text-gray-700 dark:text-slate-300">{user?.name}</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={logout}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{title}</h1>
          {subtitle ? <p className="text-gray-600 dark:text-slate-300 mt-1">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
};

export default BoltLayout;
