import { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, ShieldCheck } from 'lucide-react';
import { RippleButton } from '@/components/ui/multi-type-ripple-buttons';

const AnimatedSignIn = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSso,
  message,
  isLoading,
  isSsoLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-slate-100">Visitor Management System</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Sign in to your account to continue</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200 dark:border-slate-800">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <RippleButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700"
              variant="default"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign in</span>
                </>
              )}
            </RippleButton>

            <RippleButton
              type="button"
              onClick={onSso}
              disabled={isSsoLoading || !email}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700"
              variant="hoverborder"
              hoverBorderEffectColor="#10b981"
              hoverBorderEffectThickness="2px"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSsoLoading ? 'Signing in with SSO...' : 'Employee SSO'}</span>
            </RippleButton>

            {message ? <p className="text-sm text-rose-600 dark:text-rose-300">{message}</p> : null}
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">Secure role-based access for employee, manager, front desk, and IT admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AnimatedSignIn };