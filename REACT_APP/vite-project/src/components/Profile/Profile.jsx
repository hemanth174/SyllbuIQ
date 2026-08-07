import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  BadgeCheck,
  CalendarDays,
  Code2,
  EditIcon,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Save,
  X,
  UserRound,
} from "lucide-react";
import { useUser } from "../../context/userContext/userContext";
import AccountPageLayout from "../Account/AccountPageLayout";
import GlowBorderCard from "../ui/glow-border-card";
import { Button } from "../ui/button";
import { Link } from "react-router";
const projects = [
  {
    name: "SyllabiQ",
    description: "A focused home for learning progress.",
    tag: "React",
    color: "bg-emerald-500",
  },
  {
    name: "Study Timer",
    description: "Small rituals that make deep work easier.",
    tag: "JavaScript",
    color: "bg-sky-500",
  },
];

const Profile = () => {
  const { user, setUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [connections, setConnections] = useState([]);
  const [connectionType, setConnectionType] = useState("followers");
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const name = user?.name || "Learner";
  const email = user?.email || "No email connected";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setUsername(user?.username || "");
  }, [user?.username]);

  const saveUsername = async (event) => {
    event.preventDefault();
    if (!username.trim() || usernameSaving) return;
    setUsernameSaving(true);
    setUsernameError("");
    try {
      const response = await axios.patch("http://localhost:7000/api/auth/profile", { username }, { headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });
      setUser(response.data);
    } catch (requestError) {
      setUsernameError(requestError.response?.data?.message || "Unable to save username.");
    } finally {
      setUsernameSaving(false);
    }
  };

  const loadConnections = async (type) => {
    if (!user?.username) return;
    setConnectionType(type);
    setConnectionsOpen(true);
    try {
      const response = await axios.get(`http://localhost:7000/api/social/people/${user.username}/connections?type=${type}`, { headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });
      setConnections(response.data);
    } catch (requestError) {
      setUsernameError(requestError.response?.data?.message || "Unable to load connections.");
    }
  };

  return (
    <AccountPageLayout>
      <GlowBorderCard>
        <div className="overflow-hidden rounded-2xl">
          <div className="relative h-32 bg-[radial-gradient(circle_at_20%_20%,#67e8f9,transparent_28%),linear-gradient(120deg,#064e3b,#0f766e_48%,#0369a1)] sm:h-44">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'36\' height=\'36\' viewBox=\'0 0 36 36\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 18h36M18 0v36\' stroke=\'white\' stroke-opacity=\'.08\'/%3E%3C/svg%3E')]" />
          </div>
          <div className="relative px-5 pb-6 sm:px-8">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={name}
                className="-mt-14 h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-xl dark:border-[#10161d]"
              />
            ) : (
              <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-slate-900 text-3xl font-bold text-emerald-400 shadow-xl dark:border-[#10161d]">
                {initials}
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {name}
                  </h2>
                  <BadgeCheck size={19} className="text-emerald-500" />
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Computer Science student · Builder · Lifelong learner
                </p>
                <form onSubmit={saveUsername} className="mt-4 flex max-w-sm flex-wrap items-end gap-2">
                  <label className="min-w-[220px] flex-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Username
                    <div className="mt-1 flex items-center rounded-xl border border-slate-200 px-3 dark:border-slate-700">
                      <span className="text-slate-400">@</span>
                      <input value={username} onChange={(event) => setUsername(event.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())} placeholder="your_username" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none dark:text-white" />
                    </div>
                  </label>
                  <button type="submit" disabled={usernameSaving || !username.trim()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save size={15} /> {usernameSaving ? "Saving" : "Save"}</button>
                </form>
                {usernameError ? <p className="mt-2 text-xs text-red-500">{usernameError}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <button type="button" onClick={() => loadConnections("followers")} className="rounded-lg px-2 py-1 hover:bg-emerald-500/10"><strong className="text-slate-900 dark:text-white">{user?.followers?.length || 0}</strong> followers</button>
                  <button type="button" onClick={() => loadConnections("following")} className="rounded-lg px-2 py-1 hover:bg-emerald-500/10"><strong className="text-slate-900 dark:text-white">{user?.following?.length || 0}</strong> following</button>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> India
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Code2 size={14} /> GitHub connected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/home/setting/">
                  <Button
                    className="p-2 rounded-full"
                    onClick={() => setEditing((value) => !value)}
                  >
                    {editing ? <EditIcon /> : <Pencil />}
                  </Button>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </GlowBorderCard>

      {editing ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          <strong>Profile editing is ready.</strong> Update your account details
          from Settings to keep this profile in sync.
        </div>
      ) : null}

      {connectionsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setConnectionsOpen(false)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#10161d]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="text-lg font-black">{connectionType === "followers" ? "Followers" : "Following"}</h2><button type="button" onClick={() => setConnectionsOpen(false)} aria-label="Close"><X size={19} /></button></div>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{connections.length ? connections.map((person) => <Link key={person._id} to={`/home/profile/${person.username}`} onClick={() => setConnectionsOpen(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-emerald-500/10"><img src={person.avatar || "https://i.pravatar.cc/64?img=12"} alt="" className="h-9 w-9 rounded-full" /><span><strong className="block text-sm">{person.name}</strong><small className="text-xs text-emerald-500">@{person.username}</small></span></Link>) : <p className="py-6 text-center text-sm text-slate-500">No {connectionType} yet.</p>}</div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <main className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                  About
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  A little about the learner
                </h2>
              </div>
              <UserRound size={20} className="text-slate-400" />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Building better study habits one focused session at a time.
              Currently learning full-stack development and documenting the
              journey.
            </p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                  Selected work
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  Featured projects
                </h2>
              </div>
              <Button variant="ghost" size="icon" aria-label="Add project">
                <Plus size={18} />
              </Button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.name}
                  className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-emerald-400 dark:border-slate-800"
                >
                  <div
                    className={`mb-5 h-1 w-10 rounded-full ${project.color}`}
                  />
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {project.description}
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {project.tag}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </main>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#10161d]">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-emerald-500" />
              <h2 className="font-bold text-slate-950 dark:text-white">
                Progress snapshot
              </h2>
            </div>
            <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
              {[
                ["45.6h", "Study time"],
                ["8", "Day streak"],
                ["23", "Topics done"],
                ["6", "Projects"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="font-bold text-emerald-500">{value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#10161d]">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-sky-500" />
              <h2 className="font-bold text-slate-950 dark:text-white">
                Member since
              </h2>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Your learning journey is just getting started.
            </p>
          </section>
        </aside>
      </div>
    </AccountPageLayout>
  );
};

export default Profile;
