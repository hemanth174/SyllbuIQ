import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { BarChart3, Check, Globe2, Heart, ImagePlus, LoaderCircle, MessageCircle, Plus, Send, Sparkles, UserPlus, X } from "lucide-react";
import { useUser } from "../../context/userContext/userContext";
import { useTheme } from "../../context/Themecontext/ThemeContext";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";

const API_URL = "http://localhost:7000/api/social";
const authConfig = () => ({ headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });

const Feed = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [scope, setScope] = useState("all");
  const [draft, setDraft] = useState("");
  const [image, setImage] = useState("");
  const [people, setPeople] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentSaving, setCommentSaving] = useState({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadFeed = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/feed?scope=${scope}`, authConfig());
      setPosts(response.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load activity.");
    } finally { setLoading(false); }
  }, [scope]);

  useEffect(() => { loadFeed(); }, [loadFeed]);
  useRealtimeUpdates((message) => { if (message.type === "inbox:changed" || message.type === "feed:changed") loadFeed(); });

  const mentionQuery = useMemo(() => {
    const match = draft.match(/(?:^|\s)@([a-z0-9_]*)$/i);
    return match ? match[1] : null;
  }, [draft]);

  useEffect(() => {
    if (mentionQuery === null || mentionQuery.length < 2) { setPeople([]); return undefined; }
    const timer = window.setTimeout(async () => {
      try { const response = await axios.get(`${API_URL}/people?q=${encodeURIComponent(mentionQuery)}`, authConfig()); setPeople(response.data); } catch { setPeople([]); }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [mentionQuery]);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 3500000) { setError("Choose an image smaller than 3.5 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const submitPost = async (event) => {
    event.preventDefault();
    if ((!draft.trim() && !image) || posting) return;
    setPosting(true);
    try { await axios.post(`${API_URL}/posts`, { content: draft.trim() || "Shared an image", image }, authConfig()); setDraft(""); setImage(""); setPeople([]); await loadFeed(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to publish post."); }
    finally { setPosting(false); }
  };

  const addMention = (username) => {
    setDraft((value) => value.replace(/(?:^|\s)@([a-z0-9_]*)$/i, (match) => `${match.startsWith(" ") ? " " : ""}@${username} `));
    setPeople([]);
  };

  const toggleLike = async (postId) => {
    try { const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, authConfig()); setPosts((current) => current.map((post) => post._id === postId ? { ...post, liked: response.data.liked, likesCount: response.data.likesCount } : post)); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to update like."); }
  };

  const submitComment = async (postId) => {
    const content = commentDrafts[postId]?.trim();
    if (!content || commentSaving[postId]) return;
    setCommentSaving((current) => ({ ...current, [postId]: true }));
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, authConfig());
      setPosts((current) => current.map((post) => post._id === postId ? { ...post, comments: [...(post.comments || []), response.data] } : post));
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to add comment."); }
    finally { setCommentSaving((current) => ({ ...current, [postId]: false })); }
  };

  const text = darkMode ? "text-white" : "text-slate-900";
  const panel = darkMode ? "border-white/[0.08] bg-[#10161d]" : "border-slate-200 bg-white";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const avatar = user?.avatar || "https://i.pravatar.cc/96?img=68";

  return <div className={`mx-auto w-full max-w-7xl ${text}`}>
    <section className="relative mb-7 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.12] via-white to-sky-500/[0.08] p-6 dark:via-[#0e141a] sm:p-8"><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Community workspace</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Your activity</h1><p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">Share what you are learning, follow people you trust, and build momentum together.</p></div><div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300"><UserPlus size={17} /> Use @ to connect</div></div></section>
    {error ? <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{error}</div> : null}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><main className="min-w-0">
      <form onSubmit={submitPost} className={`rounded-2xl border p-5 ${panel}`}><div className="flex gap-3"><img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" /><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows="3" placeholder="Share a learning win or mention someone with @username..." className="min-w-0 flex-1 resize-none bg-transparent pt-1 text-sm leading-6 outline-none placeholder:text-slate-400" /></div>{people.length ? <div className="mt-2 max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-white/[0.1] dark:bg-[#151c23]">{people.map((person) => <button key={person._id} type="button" onClick={() => addMention(person.username)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-emerald-500/10"><img src={person.avatar || "https://i.pravatar.cc/64?img=12"} alt="" className="h-7 w-7 rounded-full" /><span className="min-w-0"><strong className="block truncate text-sm">{person.name}</strong><small className="text-xs text-emerald-500">@{person.username}</small></span></button>)}</div> : null}{image ? <div className="relative mt-3 inline-block"><img src={image} alt="Post preview" className="max-h-48 rounded-xl object-cover" /><button type="button" onClick={() => setImage("")} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white" aria-label="Remove image"><X size={14} /></button></div> : null}<div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/[0.08]"><div><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" /><button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500"><ImagePlus size={16} /> Add image</button><span className="ml-2 text-xs text-slate-400">{draft.length}/2000</span></div><button type="submit" disabled={(!draft.trim() && !image) || posting} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{posting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />} Post</button></div></form>
      <div className="mt-7 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08]"><h2 className="flex items-center gap-2 pb-4 text-lg font-black"><BarChart3 size={19} className="text-emerald-500" /> Recent activity</h2><div className="flex gap-4 text-sm">{[["all", "All"], ["following", "Following"]].map(([value, label]) => <button key={value} type="button" onClick={() => setScope(value)} className={`border-b-2 px-1 pb-4 font-semibold ${scope === value ? "border-emerald-400 text-emerald-500" : `border-transparent ${muted}`}`}>{label}</button>)}</div></div>
      <div className="space-y-4 pt-5">{loading ? <div className={`flex min-h-48 items-center justify-center rounded-2xl border ${panel} ${muted}`}><LoaderCircle className="mr-2 animate-spin" size={18} /> Loading activity...</div> : posts.length ? posts.map((post) => <article key={post._id} className={`rounded-2xl border p-5 ${panel}`}><div className="flex items-start gap-3"><img src={post.author?.avatar || "https://i.pravatar.cc/96?img=12"} alt="" className="h-11 w-11 rounded-full object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Link to={post.author?.username ? `/home/profile/${post.author.username}` : "/home/profile"} className="font-bold hover:text-emerald-500">{post.author?.name || "Learner"}</Link>{post.author?.username ? <span className="text-xs text-emerald-500">@{post.author.username}</span> : null}<span className={`flex items-center gap-1 text-xs ${muted}`}><span>·</span>{new Date(post.createdAt).toLocaleDateString()}</span></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7">{post.content.split(/(@[a-z0-9_]+)/gi).map((part, index) => part.startsWith("@") ? <span key={`${part}-${index}`} className="font-semibold text-emerald-500">{part}</span> : part)}</p>{post.image ? <img src={post.image} alt="Post attachment" className="mt-4 max-h-[420px] w-full rounded-xl object-cover" /> : null}<div className={`mt-5 flex items-center gap-5 border-t pt-3 text-sm ${muted} dark:border-white/[0.08]`}><button type="button" onClick={() => toggleLike(post._id)} className={`flex items-center gap-2 transition hover:text-rose-500 ${post.liked ? "text-rose-500" : ""}`}><Heart size={17} fill={post.liked ? "currentColor" : "none"} /> {post.likesCount}</button><button type="button" onClick={() => setCommentsOpen((current) => ({ ...current, [post._id]: !current[post._id] }))} className="flex items-center gap-2 transition hover:text-sky-500"><MessageCircle size={17} /> {post.comments?.length || 0}</button><span className="ml-auto flex items-center gap-1 text-xs"><Globe2 size={13} /> Community</span></div>{commentsOpen[post._id] ? <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/[0.08]"><div className="space-y-3">{post.comments?.length ? post.comments.map((comment) => <div key={comment._id} className="flex gap-2"><img src={comment.author?.avatar || "https://i.pravatar.cc/64?img=12"} alt="" className="h-7 w-7 rounded-full" /><div className="rounded-xl bg-slate-100 px-3 py-2 text-xs dark:bg-white/[0.06]"><Link to={comment.author?.username ? `/home/profile/${comment.author.username}` : "/home/profile"} className="font-bold hover:text-emerald-500">{comment.author?.name || "Learner"}</Link><p className="mt-1 leading-5">{comment.content}</p></div></div>) : <p className="text-xs text-slate-500">No comments yet. Start the discussion.</p>}</div><div className="mt-3 flex gap-2"><input value={commentDrafts[post._id] || ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post._id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") submitComment(post._id); }} placeholder="Write a comment..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs outline-none focus:border-emerald-400 dark:border-white/[0.1]" /><button type="button" onClick={() => submitComment(post._id)} disabled={!commentDrafts[post._id]?.trim() || commentSaving[post._id]} className="rounded-xl bg-emerald-500 px-3 text-white disabled:opacity-50" aria-label="Send comment">{commentSaving[post._id] ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}</button></div></div> : null}</div></div></article>) : <div className={`rounded-2xl border p-12 text-center ${panel}`}><Sparkles className="mx-auto text-emerald-500" /><p className={`mt-3 text-sm ${muted}`}>{scope === "following" ? "Follow people to see their activity here." : "Be the first to share a learning win."}</p></div>}</div>
    </main><aside className="space-y-5"><section className={`rounded-2xl border p-5 ${panel}`}><h2 className="font-bold">Make it social</h2><p className={`mt-2 text-sm leading-6 ${muted}`}>Set your username in Profile, then mention people with <span className="font-semibold text-emerald-500">@username</span> in posts and comments.</p><div className="mt-5 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"><Check size={16} className="mb-1" /> Requests are approved from Inbox.</div></section><section className={`rounded-2xl border p-5 ${panel}`}><h2 className="flex items-center gap-2 font-bold"><Plus size={18} className="text-emerald-500" /> What you can share</h2><div className={`mt-4 space-y-3 text-sm ${muted}`}><p>Learning milestones</p><p>Project progress</p><p>Study notes and discoveries</p><p>Images and resources</p></div></section></aside></div>
  </div>;
};

export default Feed;
