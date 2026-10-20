import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserById } from "../../services/userService.js";
import useAuthStore from "../../store/authStore.js";
import Spinner from "../ui/Spinner.jsx";

const themeConfig = {
  student: {
    gradient: "from-accent/80 to-accent-blue/80",
    avatarFrom: "bg-accent",
    iconColor: "text-accent",
    roleBadge: "bg-level-beginner/10 text-level-beginner",
    linkPrimaryBg: "bg-accent/5",
    linkPrimaryText: "text-accent",
    linkPrimaryHover: "hover:bg-accent/10",
    linkPrimaryDesc: "text-accent",
    linkSecondaryBg: "bg-accent-blue/5",
    linkSecondaryText: "text-accent-blue",
    linkSecondaryHover: "hover:bg-accent-blue/10",
    linkSecondaryDesc: "text-accent-blue",
    backPath: "/student/dashboard",
  },
  instructor: {
    gradient: "from-level-intermediate/80 to-level-advanced/80",
    avatarFrom: "bg-level-intermediate",
    iconColor: "text-level-intermediate",
    roleBadge: "bg-level-intermediate/10 text-level-intermediate",
    linkPrimaryBg: "bg-level-intermediate/5",
    linkPrimaryText: "text-level-intermediate",
    linkPrimaryHover: "hover:bg-level-intermediate/10",
    linkPrimaryDesc: "text-level-intermediate",
    linkSecondaryBg: "bg-level-advanced/5",
    linkSecondaryText: "text-level-advanced",
    linkSecondaryHover: "hover:bg-level-advanced/10",
    linkSecondaryDesc: "text-level-advanced",
    backPath: "/instructor/dashboard",
  },
};

export default function ProfilePage({ role = "student", quickLinks = [] }) {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = themeConfig[role] || themeConfig.student;

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    getUserById(user.id)
      .then((res) => { if (!cancelled) setProfile(res.data); })
      .catch(() => { if (!cancelled) setProfile(user); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <Spinner size="lg" className="py-20" />;

  const displayUser = profile || user;
  const initials = displayUser?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to={theme.backPath}
          className="text-sm text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border overflow-hidden mb-8">
        <div className={`h-28 bg-gradient-to-r ${theme.gradient}`} />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className={`w-24 h-24 rounded-2xl ${theme.avatarFrom} text-white text-3xl font-bold flex items-center justify-center shadow-lg border-4 border-white dark:border-border`}>
              {initials}
            </div>
            <div className="sm:pb-1">
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">{displayUser.name}</h1>
              <p className="text-muted">{displayUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6">
          <h2 className={`text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2`}>
            <svg className={`w-5 h-5 ${theme.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium">Full Name</label>
              <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">{displayUser.name}</p>
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium">Email</label>
              <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">{displayUser.email}</p>
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium">Role</label>
              <div className="mt-0.5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${theme.roleBadge}`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {displayUser.role}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium">Member Since</label>
              <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                {displayUser.createdAt
                  ? new Date(displayUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6">
          <h2 className={`text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2`}>
            <svg className={`w-5 h-5 ${theme.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickLinks.map((link, idx) => {
              const isPrimary = idx === 0;
              const bg = isPrimary ? theme.linkPrimaryBg : theme.linkSecondaryBg;
              const text = isPrimary ? theme.linkPrimaryText : theme.linkSecondaryText;
              const hover = isPrimary ? theme.linkPrimaryHover : theme.linkSecondaryHover;
              const desc = isPrimary ? theme.linkPrimaryDesc : theme.linkSecondaryDesc;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 p-3 rounded-xl ${bg} ${text} ${hover} transition-all duration-200`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className={`text-xs ${desc}`}>{link.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
