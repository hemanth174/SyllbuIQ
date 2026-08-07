import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bell, Check, LoaderCircle, UserPlus, Users, X } from "lucide-react";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";

const API_URL = "https://syllbuiq-production.up.railway.app/api/social";
const config = () => ({ headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });

const Inbox = () => {
  const [data, setData] = useState({ requests: [], notifications: [], unreadCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try { const response = await axios.get(`${API_URL}/inbox`, config()); setData(response.data); setError(""); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to load your inbox."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useRealtimeUpdates((message) => { if (message.type === "inbox:changed") load(); });

  const respond = async (id, action) => {
    try { await axios.patch(`${API_URL}/requests/${id}`, { action }, config()); await load(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to update request."); }
  };

  const read = async (notification) => {
    if (notification.read) return;
    try { await axios.patch(`${API_URL}/notifications/${notification._id}/read`, {}, config()); setData((current) => ({ ...current, unreadCount: Math.max(0, current.unreadCount - 1), notifications: current.notifications.map((item) => item._id === notification._id ? { ...item, read: true } : item) })); }
    catch { /* A read receipt should not block the inbox. */ }
  };

  return <div className="mx-auto w-full max-w-4xl space-y-7"><section className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.12] via-white to-violet-500/[0.08] p-6 dark:via-[#0e141a] sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Your network</p><h1 className="mt-2 text-3xl font-black tracking-tight">Inbox</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Approve follow requests, join project workspaces, and keep up with mentions.</p></section>{error ? <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</div> : null}{loading ? <div className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500 dark:border-white/[0.08] dark:bg-[#10161d]"><LoaderCircle className="mr-2 animate-spin" size={18} /> Loading inbox...</div> : <><section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#10161d]"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><UserPlus size={19} className="text-emerald-500" /> Pending requests</h2><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">{data.requests.length}</span></div><div className="mt-4 space-y-3">{data.requests.length ? data.requests.map((request) => <div key={request._id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/[0.08]"><img src={request.requester?.avatar || "https://i.pravatar.cc/64?img=12"} alt="" className="h-10 w-10 rounded-full" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{request.requester?.name}</p><p className="text-xs text-slate-500">@{request.requester?.username || "learner"} · {request.type === "collaborate" ? `Join ${request.project?.name}` : "Follow request"}</p></div><div className="flex gap-2"><button type="button" onClick={() => respond(request._id, "reject")} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-red-500 dark:border-white/[0.1]" aria-label="Reject request"><X size={16} /></button><button type="button" onClick={() => respond(request._id, "approve")} className="rounded-lg bg-emerald-500 p-2 text-white hover:bg-emerald-600" aria-label="Approve request"><Check size={16} /></button></div></div>) : <p className="py-5 text-sm text-slate-500">No pending requests.</p>}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#10161d]"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Bell size={19} className="text-violet-500" /> Notifications</h2><span className="text-xs text-slate-500">{data.unreadCount} unread</span></div><div className="mt-4 divide-y divide-slate-200 dark:divide-white/[0.08]">{data.notifications.length ? data.notifications.map((notification) => <button type="button" key={notification._id} onClick={() => read(notification)} className={`flex w-full items-start gap-3 py-4 text-left transition first:pt-1 hover:bg-slate-50 dark:hover:bg-white/[0.03] ${notification.read ? "opacity-60" : ""}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? "bg-slate-300 dark:bg-slate-600" : "bg-emerald-500"}`} /><div className="min-w-0 flex-1"><p className="text-sm">{notification.message}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Users size={12} /> @{notification.actor?.username || notification.actor?.name || "learner"} · {new Date(notification.createdAt).toLocaleString()}</p></div></button>) : <p className="py-5 text-sm text-slate-500">Your notifications will appear here.</p>}</div></section></>}</div>;
};

export default Inbox;
