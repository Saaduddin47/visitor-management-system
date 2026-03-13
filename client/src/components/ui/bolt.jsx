export const StatCard = ({ label, value, tone = 'slate', icon: Icon }) => {
  const toneStyles = {
    slate: {
      value: 'text-slate-900 dark:text-slate-100',
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      icon: 'text-slate-600 dark:text-slate-300'
    },
    green: {
      value: 'text-green-600 dark:text-green-300',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      icon: 'text-green-600 dark:text-green-300'
    },
    yellow: {
      value: 'text-yellow-600 dark:text-yellow-300',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
      icon: 'text-yellow-600 dark:text-yellow-300'
    },
    blue: {
      value: 'text-blue-600 dark:text-blue-300',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      icon: 'text-blue-600 dark:text-blue-300'
    },
    red: {
      value: 'text-red-600 dark:text-red-300',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      icon: 'text-red-600 dark:text-red-300'
    },
    purple: {
      value: 'text-purple-600 dark:text-purple-300',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      icon: 'text-purple-600 dark:text-purple-300'
    }
  };

  const style = toneStyles[tone] || toneStyles.slate;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${style.value}`}>{value}</p>
        </div>
        {Icon ? (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${style.iconBg}`}>
            <Icon className={`w-6 h-6 ${style.icon}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const SectionCard = ({ title, children, actions }) => (
  <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-800">
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h2>
      {actions}
    </div>
    {children}
  </section>
);

export const StatusBadge = ({ status, map }) => {
  const cls = map?.[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  return <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${cls}`}>{status}</span>;
};
