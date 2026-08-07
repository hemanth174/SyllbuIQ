import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowLeft, Check, Heart, LoaderCircle, UserPlus, X } from "lucide-react";

const API_URL = "http://localhost:7000/api/social";
const config = () => ({ headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [connections, setConnections] = useState([]);
  const [connectionType, setConnectionType] = useState("followers");
  const [connectionsOpen, setConnectionsOpen] = useState(false);

  const load = useCallback(async () => {
    try { const response = await axios.get(`${API_URL}/people/${username}`, config()); setData(response.data); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to load profile."); }
    finally { setLoading(false); }
  }, [username]);
  useEffect(() => { load(); }, [load]);

  const loadConnections = async (type) => {
    setConnectionType(type);
    setConnectionsOpen(true);
    try { const response = await axios.get(`${API_URL}/people/${username}/connections?type=${type}`, config()); setConnections(response.data); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to load connections."); }
  };

  const toggleFollow = async () => {
    if (!data?.profile || busy) return;
    setBusy(true);
    try {
      if (data.profile.followStatus === "accepted") {
        await axios.delete(`${API_URL}/follow/${data.profile.username}`, config());
        setData((current) => ({ ...current, profile: { ...current.profile, followStatus: "none", followersCount: Math.max(0, current.profile.followersCount - 1) } }));
      } else {
        await axios.post(`${API_URL}/follow/${data.profile.username}`, {}, config());
        setData((current) => ({ ...current, profile: { ...current.profile, followStatus: "pending" } }));
      }
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to update follow status."); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="flex min-h-64 items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 animate-spin" size={18} /> Loading profile...</div>;
  if (error || !data) return <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-500">{error || "Profile not found"}</div>;
  const { profile, posts } = data;
  const avatar = profile.avatar || "https://i.pravatar.cc/96?img=12";

  return <div className="mx-auto w-full max-w-4xl space-y-6"><button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-500"><ArrowLeft size={16} /> Back</button><section className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-white dark:border-white/[0.08] dark:bg-[#10161d]"><div className="h-36 bg-gradient-to-br from-emerald-600 via-teal-500 to-sky-500 sm:h-48" /><div className="relative px-5 pb-6 sm:px-8"><img src={avatar} alt={profile.name} className="-mt-12 h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-xl dark:border-[#10161d]" /><div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><h1 className="flex items-center gap-2 text-2xl font-black">{profile.name}<Check size={18} className="rounded-full bg-emerald-500 p-0.5 text-white" /></h1><p className="mt-1 text-sm text-emerald-500">@{profile.username}</p><div className="mt-4 flex gap-2 text-sm"><button type="button" onClick={() => loadConnections("followers")} className="rounded-lg px-2 py-1 text-left hover:bg-emerald-500/10"><strong>{profile.followersCount}</strong> <span className="text-slate-500">followers</span></button><button type="button" onClick={() => loadConnections("following")} className="rounded-lg px-2 py-1 text-left hover:bg-emerald-500/10"><strong>{profile.followingCount}</strong> <span className="text-slate-500">following</span></button></div></div>{!profile.isSelf ? <button type="button" onClick={toggleFollow} disabled={busy || profile.followStatus === "pending"} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${profile.followStatus === "accepted" ? "border border-rose-300 text-rose-600 hover:bg-rose-500/10" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}><UserPlus size={16} />{profile.followStatus === "pending" ? "Request pending" : profile.followStatus === "accepted" ? "Unfollow" : "Follow"}</button> : null}</div></div></section><section><h2 className="mb-4 text-xl font-black">{profile.isSelf ? "Your posts" : `${profile.name}'s posts`}</h2><div className="space-y-4">{posts.length ? posts.map((post) => <article key={post._id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#10161d]"><p className="whitespace-pre-wrap text-sm leading-7">{post.content}</p>{post.image ? <img src={post.image} alt="Post attachment" className="mt-4 max-h-96 w-full rounded-xl object-cover" /> : null}<div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Heart size={14} /> {post.likesCount} likes · {post.comments?.length || 0} comments</div></article>) : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-white/[0.12]">No posts yet.</div>}</div></section>{connectionsOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setConnectionsOpen(false)}><div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#10161d]" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-lg font-black">{connectionType === "followers" ? "Followers" : "Following"}</h2><button type="button" onClick={() => setConnectionsOpen(false)} aria-label="Close"><X size={19} /></button></div><div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{connections.length ? connections.map((person) => <Link key={person._id} to={`/home/profile/${person.username}`} onClick={() => setConnectionsOpen(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-emerald-500/10"><img src={person.avatar || "https://i.pravatar.cc/64?img=12"} alt="" className="h-9 w-9 rounded-full" /><span><strong className="block text-sm">{person.name}</strong><small className="text-xs text-emerald-500">@{person.username}</small></span></Link>) : <p className="py-6 text-center text-sm text-slate-500">No {connectionType} yet.</p>}</div></div></div> : null}</div>;
};

export default PublicProfile;
