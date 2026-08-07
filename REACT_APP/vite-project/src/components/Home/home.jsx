import { Outlet, Link, useLocation, useNavigate } from "react-router";
import LogoImg from "../../assets/syllabiq-logo.svg";
import data from "./headsidebarsFolder/sidebar";
import Cookies from "js-cookie";
import axios from "axios";
import { useUser } from "../../context/userContext/userContext";
import ThemeButton from "../../context/Themecontext/Themebutton";
import { useTheme } from "../../context/Themecontext/ThemeContext";
import { useEffect, useState } from "react";
import SearchModal from "@/components/ui/search-modal";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  FolderKanban,
  LogOut,
  Menu,
  Search,
  Settings2,
  UserCircle,
  UserPlus,
  X,
} from "lucide-react";

const workspaceSearchResults = [
  {
    name: "Your Activity",
    meta: "Workspace",
    href: "/home/feed",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    name: "Syllabus",
    meta: "Workspace",
    href: "/home/syllabus",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    name: "Analytics",
    meta: "Workspace",
    href: "/home/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Projects",
    meta: "Workspace",
    href: "/home/projects",
    icon: <FolderKanban className="h-4 w-4" />,
  },
  {
    name: "Skills",
    meta: "Workspace",
    href: "/home/skills",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    name: "Inbox",
    meta: "Network",
    href: "/home/inbox",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    name: "Profile",
    meta: "Account",
    href: "/home/profile",
    icon: <UserCircle className="h-4 w-4" />,
  },
  {
    name: "Settings",
    meta: "Account",
    href: "/home/setting",
    icon: <Settings2 className="h-4 w-4" />,
  },
];

const primaryItems = data.filter((item) => item.placement !== "secondary");
const secondaryItems = data.filter((item) => item.placement === "secondary");

const NavItem = ({ item, active, mobile = false, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`group relative flex items-center gap-3 rounded-2xl transition-all ${mobile ? "min-w-16 flex-col gap-1 px-2 py-2 text-center" : "px-3 py-3"} ${active ? "bg-emerald-400/10 text-emerald-600 dark:text-emerald-400" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white"}`}
  >
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl ${mobile ? "h-9 w-9" : "h-10 w-10"} ${active ? "bg-emerald-400/15" : "bg-white/[0.03]"}`}
    >
      <img
        src={item.IconUrl}
        alt=""
        className={`${mobile ? "h-6 w-6" : "h-7 w-7"} object-contain`}
      />
    </span>
    <span className={`${mobile ? "text-[10px]" : "text-sm"} font-semibold`}>
      {item.ItemName}
    </span>
    {active && !mobile ? (
      <span className="absolute right-3 top-3 h-2 p-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
    ) : null}
  </Link>
);

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { darkMode } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inbox, setInbox] = useState({ unreadCount: 0, notifications: [] });
  const [peopleSearchResults, setPeopleSearchResults] = useState([]);

  const currentPath = data.find((item) =>
    location.pathname.endsWith(item.path),
  );

  const loadInbox = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/social/inbox",
        {
          headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` },
        },
      );
      setInbox(response.data);
    } catch {
      setInbox({ unreadCount: 0, notifications: [] });
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useRealtimeUpdates((message) => {
    if (message.type === "inbox:changed") loadInbox();
  });

  useEffect(() => {
    // Inbox refreshes from the server and broadcasts changes through the header.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInbox();
    const timer = window.setInterval(loadInbox, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const logout = () => {
    Cookies.remove("sylluIQTokens");
    navigate("/login");
  };

  const cancelFollowRequest = async (person) => {
    try {
      await axios.patch(
        `http://localhost:7000/api/social/requests/${person.requestId}`,
        { action: "cancel" },
        {
          headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` },
        },
      );
      setPeopleSearchResults((current) =>
        current.map((item) =>
          item.meta === `@${person.username}`
            ? {
                ...item,
                actions: [
                  {
                    icon: <UserPlus className="h-4 w-4" />,
                    label: "Send follow request",
                    onClick: () => sendFollowRequest(person),
                  },
                ],
              }
            : item,
        ),
      );
    } catch {
      // The Inbox remains the source of truth if the request changed elsewhere.
    }
  };

  const unfollowPerson = async (person) => {
    try {
      await axios.delete(`http://localhost:7000/api/social/follow/${person.username}`, { headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });
      setPeopleSearchResults((current) => current.map((item) => item.meta === `@${person.username}` ? { ...item, actions: [{ icon: <UserPlus className="h-4 w-4" />, label: "Send follow request", onClick: () => sendFollowRequest(person) }] } : item));
    } catch {
      // Keep the profile searchable if the relationship changed elsewhere.
    }
  };

  const handleSearchQuery = async (query) => {
    if (!query.trim().startsWith("@") || query.trim().length < 3) {
      setPeopleSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:7000/api/social/people?q=${encodeURIComponent(query.trim())}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` },
        },
      );
      setPeopleSearchResults(
        response.data.map((person) => ({
          name: person.name,
          meta: `@${person.username}`,
          href: `/home/profile/${person.username}`,
          icon: <UserCircle className="h-4 w-4" />,
          actions:
            person.followStatus === "pending"
              ? [
                  {
                    icon: <UserPlus className="h-4 w-4" />,
                    label: "Cancel follow request",
                    onClick: () => cancelFollowRequest(person),
                  },
                ]
              : person.followStatus === "accepted"
                ? [
                    {
                      icon: <UserPlus className="h-4 w-4" />,
                      label: "Unfollow",
                      onClick: () => unfollowPerson(person),
                    },
                  ]
                : [
                  {
                    icon: <UserPlus className="h-4 w-4" />,
                    label: "Send follow request",
                    onClick: () => sendFollowRequest(person),
                  },
                ],
        })),
      );
    } catch {
      setPeopleSearchResults([]);
    }
  };

  const sendFollowRequest = async (person) => {
    try {
      const response = await axios.post(
        `http://localhost:7000/api/social/follow/${person.username}`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` },
        },
      );
      const requestId = response.data.requestId;
      setPeopleSearchResults((current) =>
        current.map((item) =>
          item.meta === `@${person.username}`
            ? {
                ...item,
                requestId,
                actions: [
                  {
                    icon: <UserPlus className="h-4 w-4" />,
                    label: "Cancel follow request",
                    onClick: () =>
                      cancelFollowRequest({ ...person, requestId }),
                  },
                ],
              }
            : item,
        ),
      );
    } catch {
      // The result remains searchable; the Inbox shows the authoritative status.
    }
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} flex h-screen min-h-0 overflow-hidden bg-slate-100 text-slate-900 dark:bg-[#080b0f] dark:text-white`}
    >
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-hidden border-r border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0a0e13] lg:flex lg:flex-col">
        <div className="flex h-[76px] items-center border-b border-slate-200 px-5 dark:border-white/[0.08]">
          <Link
            to="/home/feed"
            className="rounded-xl bg-slate-50 px-3 py-1 dark:bg-white/[0.04]"
          >
            <img
              src={LogoImg}
              alt="SyllabiQ"
              className="h-full wfull object-contain"
            />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1">
            {primaryItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                active={location.pathname.endsWith(item.path)}
              />
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-200 pt-5 dark:border-white/[0.08] flex flex-col gap-2">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Account
            </p>
            {secondaryItems.map((item) =>
              item.ItemName === "Profile" ? (
                <Link
                  key={item.id}
                  to={item.path}
                  className="mb-2 flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-emerald-400/40 hover:bg-emerald-400/5 dark:border-white/[0.08]"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.IconUrl}
                      alt={item.ItemName}
                      className="h-10 w-10"
                    />
                  )}
                  <span className="min-w-0">
                    <strong className="block truncate text-xs font-bold uppercase">
                      {user?.name || "Your profile"}
                    </strong>
                    <small className="block truncate text-[10px] text-slate-500">
                      {user?.email || "Open profile"}
                    </small>
                  </span>
                </Link>
              ) : (
                <NavItem
                  key={item.id}
                  item={item}
                  active={location.pathname.endsWith(item.path)}
                />
              ),
            )}
          </div>
        </div>
      </aside>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0a0e13]/90 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 sm:block">
                SyllabiQ workspace
              </p>
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                {currentPath?.ItemName ||
                  (location.pathname.endsWith("/inbox")
                    ? "Inbox"
                    : "Workspace")}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open global search"
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/[0.1] dark:text-slate-300"
            >
              <Search size={18} />
              <span className="hidden text-xs sm:block">Search</span>
              <kbd className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-white/[0.08] sm:block">
                ⌘ K
              </kbd>
            </button>
            <div className="group relative">
              <button
                type="button"
                onClick={() => navigate("/home/inbox")}
                aria-label={`Open inbox${inbox.unreadCount ? `, ${inbox.unreadCount} unread` : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/[0.1] dark:text-slate-300"
              >
                <Bell size={18} />
                {inbox.unreadCount > 0 ? (
                  <span className="absolute  -right-1 -top-1 flex  items-center justify-center rounded-full bg-emerald-500 h-4 px-[6px] text-[10px] font-black text-white">
                    {inbox.unreadCount > 9 ? "9+" : inbox.unreadCount}
                  </span>
                ) : null}
              </button>
              <div className="pointer-events-none invisible absolute right-0 top-12 z-50 w-72 translate-y-1 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-2xl transition-all group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/[0.1] dark:bg-[#151c23]">
                <div className="flex items-center justify-between px-2">
                  <strong className="text-sm">Inbox</strong>
                  <button
                    type="button"
                    onClick={() => navigate("/home/inbox")}
                    className="text-xs font-semibold text-emerald-500"
                  >
                    View all
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {inbox.notifications?.slice(0, 3).map((item) => (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => navigate("/home/inbox")}
                      className="block w-full truncate rounded-lg px-2 py-2 text-left text-xs text-slate-500 hover:bg-emerald-500/10 dark:text-slate-300"
                    >
                      {item.message}
                    </button>
                  ))}
                  {!inbox.notifications?.length ? (
                    <p className="px-2 py-3 text-xs text-slate-500">
                      No new notifications.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <ThemeButton />
            <button
              type="button"
              onClick={logout}
              className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-500 transition hover:border-red-400 hover:text-red-500 dark:border-white/[0.1] sm:flex"
            >
              <LogOut size={16} />{" "}
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-slate-50 p-4 pb-24 dark:bg-[#080b0f] sm:p-6 lg:p-8 lg:pb-8">
          <SearchModal
            modal
            open={searchOpen}
            onOpenChange={setSearchOpen}
            results={[...workspaceSearchResults, ...peopleSearchResults]}
            onQueryChange={handleSearchQuery}
            onSelectResult={() => setSearchOpen(false)}
            quickActions={[
              {
                label: "Open profile",
                shortcut: "P",
                onClick: () => {
                  navigate("/home/profile");
                  setSearchOpen(false);
                },
              },
              {
                label: "Open settings",
                shortcut: "S",
                onClick: () => {
                  navigate("/home/setting");
                  setSearchOpen(false);
                },
              },
              {
                label: "Open syllabus",
                shortcut: "Y",
                onClick: () => {
                  navigate("/home/syllabus");
                  setSearchOpen(false);
                },
              },
            ]}
          />
          <Outlet />
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-1 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0a0e13]/95 lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-around py-1.5">
            {primaryItems.slice(0, 5).map((item) => (
              <NavItem
                key={item.id}
                item={item}
                active={location.pathname.endsWith(item.path)}
                mobile
              />
            ))}
          </div>
        </nav>
        {mobileMenuOpen ? (
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute inset-y-0 left-0 w-[min(82vw,320px)] overflow-y-auto bg-white p-5 shadow-2xl dark:bg-[#0a0e13]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <img
                  src={LogoImg}
                  alt="SyllabiQ"
                  className="h-10 w-[145px] object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                >
                  <X size={21} />
                </button>
              </div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                All pages
              </p>
              <nav className="space-y-1">
                {[...primaryItems, ...secondaryItems].map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    active={location.pathname.endsWith(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
              </nav>
              <button
                type="button"
                onClick={logout}
                className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-sm font-semibold text-red-500 dark:border-white/[0.08]"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
