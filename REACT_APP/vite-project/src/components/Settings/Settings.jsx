import { useState } from "react";
import {
  Bell,
  Check,
  LockKeyhole,
  Monitor,
  Save,
  UserRound,
} from "lucide-react";
import { useTheme } from "../../context/Themecontext/ThemeContext";
import { useUser } from "../../context/userContext/userContext";
import AccountPageLayout from "../Account/AccountPageLayout";
import { Button } from "../ui/button";

const tabs = [
  [UserRound, "Account"],
  [Monitor, "Appearance"],
  [Bell, "Notifications"],
  [LockKeyhole, "Privacy"],
];

const Toggle = ({ enabled, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    onClick={onChange}
    className={`relative h-7 w-14 rounded-full border border-slate-800/10 p-0.5 transition-colors ${enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
  >
    <span
      className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-7" : "translate-x-0"}`}
    />
  </button>
);
const Field = ({ label, value, onChange, type = "text" }) => (
  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
    {label}
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:text-white"
    />
  </label>
);

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("Account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveAccount = () => {
    setUser((current) => ({
      ...current,
      name: name || current?.name,
      email: email || current?.email,
    }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AccountPageLayout
    //   title="Settings"
      actions={
        saved ? (
          <span className="flex items-center gap-2 text-sm font-medium text-emerald-500">
            <Check size={16} /> Saved
          </span>
        ) : null
      }
    >
      <div className="grid gap-6 md:grid-cols-[210px_minmax(0,1fr)]">
        <nav
          className="flex gap-2 overflow-x-auto md:flex-col"
          aria-label="Settings sections"
        >
          {tabs.map((tab) => {
            const TabIcon = tab[0];
            const label = tab[1];
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(label)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${activeTab === label ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <TabIcon size={17} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-5">
          {activeTab === "Account" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">
                    Account details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    These details appear on your public profile.
                  </p>
                </div>
                <UserRound className="text-emerald-500" size={20} />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Display name"
                  value={name || user?.name || ""}
                  onChange={setName}
                />
                <Field
                  label="Email address"
                  type="email"
                  value={email || user?.email || ""}
                  onChange={setEmail}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={saveAccount}>
                  <Save size={15} /> Save changes
                </Button>
              </div>
            </section>
          )}
          {activeTab === "Appearance" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
              <h2 className="font-bold text-slate-950 dark:text-white">
                Appearance
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose the visual mode that keeps you focused.
              </p>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    Dark mode
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Use a darker canvas for late-night sessions.
                  </p>
                </div>
                <Toggle
                  enabled={darkMode}
                  onChange={toggleTheme}
                  label="Toggle dark mode"
                />
              </div>
            </section>
          )}
          {activeTab === "Notifications" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
              <h2 className="font-bold text-slate-950 dark:text-white">
                Notifications
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Stay in the loop without losing your focus.
              </p>
              <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  [
                    notifications,
                    setNotifications,
                    "Study reminders",
                    "Gentle nudges for planned sessions.",
                  ],
                  [
                    weekly,
                    setWeekly,
                    "Weekly progress summary",
                    "A quick recap of your learning momentum.",
                  ],
                ].map(([enabled, setter, label, description]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">
                        {label}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {description}
                      </p>
                    </div>
                    <Toggle
                      enabled={enabled}
                      onChange={() => setter((value) => !value)}
                      label={label}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          {activeTab === "Privacy" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 text-emerald-500" size={20} />
                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">
                    Privacy & security
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Your account is protected. Profile information is only shown
                    to authenticated workspace members.
                  </p>
                  <Button className="mt-5" variant="outline">
                    Review security
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </AccountPageLayout>
  );
};

export default Settings;
