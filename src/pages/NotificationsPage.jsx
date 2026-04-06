import { Bell, ArrowUpRight, ArrowDownRight, AlertCircle, Target, CheckCheck, Trash2, Check, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { clsx } from 'clsx';

const ICON_MAP = {
  income:  { icon: ArrowUpRight,  bg: 'bg-brand-green/10',  color: 'text-brand-green'  },
  expense: { icon: ArrowDownRight, bg: 'bg-brand-red/10',    color: 'text-brand-red'    },
  goal:    { icon: Target,         bg: 'bg-brand-purple/10', color: 'text-brand-purple' },
  alert:   { icon: AlertCircle,    bg: 'bg-brand-yellow/10', color: 'text-brand-yellow' },
  default: { icon: Bell,           bg: 'bg-brand-blue/10',   color: 'text-brand-blue'   },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllRead, deleteAllNotifications, role, unreadCount } = useAppContext();

  const isAdmin = role === 'Admin';

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl pb-8 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">Notifications</h2>
          <p className="text-text-secondary text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface text-sm font-medium transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          {isAdmin ? (
            <button
              onClick={() => {
                if (notifications.length === 0) return;
                if (confirm('Delete all notifications? This cannot be undone.')) deleteAllNotifications();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red/10 border border-brand-red/30 text-brand-red hover:bg-brand-red/20 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete all
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-text-secondary text-xs border border-border rounded-lg px-3 py-2">
              <Shield className="w-3.5 h-3.5" />
              Admin-only delete
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center">
            <Bell className="w-6 h-6 text-text-secondary" />
          </div>
          <p className="text-text-primary font-medium">No notifications</p>
          <p className="text-text-secondary text-sm">New activity will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => {
            const cfg = ICON_MAP[notif.type] || ICON_MAP.default;
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={clsx(
                  'bg-surface border rounded-xl p-4 flex gap-4 items-start transition-all',
                  notif.read ? 'border-border opacity-70' : 'border-brand-blue/30 shadow-sm shadow-brand-blue/10'
                )}
              >
                {/* Unread dot */}
                <div className="relative shrink-0 mt-0.5">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', cfg.bg)}>
                    <Icon className={clsx('w-5 h-5', cfg.color)} />
                  </div>
                  {!notif.read && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-surface" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={clsx('font-medium text-sm', notif.read ? 'text-text-secondary' : 'text-text-primary')}>
                      {notif.title}
                    </h4>
                    <span className="text-text-secondary text-xs shrink-0">{timeAgo(notif.time)}</span>
                  </div>
                  <p className="text-text-secondary text-sm mt-0.5">{notif.desc}</p>
                </div>

                {/* Mark as read button */}
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    title="Mark as read"
                    className="shrink-0 mt-1 text-text-secondary hover:text-brand-blue transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
