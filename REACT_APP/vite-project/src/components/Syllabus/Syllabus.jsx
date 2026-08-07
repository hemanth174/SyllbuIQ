import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Check, Edit3, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";

const MotionDiv = motion.div;
const API_URL = "https://syllbuiq-production.up.railway.app/api/syllabus";
const getConfig = () => ({ headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });
const colors = ["bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-orange-500", "bg-pink-500", "bg-amber-500"];
const semester = "Semester 02 · 2026";

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/[0.1] dark:bg-[#11171d]" onMouseDown={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]" aria-label="Close"><X size={18} /></button></div>
      {children}
    </div>
  </div>
);

const Field = ({ label, ...props }) => <label className="mt-4 block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span><input {...props} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 dark:border-white/[0.1] dark:bg-white/[0.04]" /></label>;

const Syllabus = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", code: "" });

  const load = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await axios.get(API_URL, getConfig());
      setSubjects(response.data);
      setSelectedId((current) => response.data.some((subject) => subject._id === current) ? current : response.data[0]?._id || "");
      setError("");
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to load your syllabus."); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);
  useRealtimeUpdates((message) => { if (message.type === "syllabus:changed") load(); });

  const selected = subjects.find((subject) => subject._id === selectedId) || subjects[0];
  const totals = useMemo(() => {
    const total = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const done = subjects.reduce((sum, subject) => sum + subject.topics.filter((topic) => topic.done).length, 0);
    return { total, done, progress: total ? Math.round((done / total) * 100) : 0 };
  }, [subjects]);
  const selectedStats = selected ? { total: selected.topics.length, done: selected.topics.filter((topic) => topic.done).length } : { total: 0, done: 0 };
  const selectedProgress = selectedStats.total ? Math.round((selectedStats.done / selectedStats.total) * 100) : 0;

  const openCreate = (type) => { setForm({ name: type === "topic" ? "" : "", code: "" }); setModal(type); };
  const openEditSubject = () => { setForm({ name: selected.name, code: selected.code || "" }); setModal("edit-subject"); };
  const openEditTopic = (topic) => { setForm({ name: topic.name, code: topic._id }); setModal("edit-topic"); };

  const saveSubject = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || saving) return;
    setSaving(true);
    try {
      if (modal === "edit-subject") await axios.patch(`${API_URL}/${selected._id}`, { name: form.name.trim(), code: form.code.trim() }, getConfig());
      else await axios.post(API_URL, { name: form.name.trim(), code: form.code.trim(), color: colors[subjects.length % colors.length], semester }, getConfig());
      await load(); setModal(null); setForm({ name: "", code: "" });
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save subject."); }
    finally { setSaving(false); }
  };

  const saveTopic = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || saving || !selected) return;
    setSaving(true);
    try {
      const topics = selected.topics.map((topic) => topic._id === form.code ? { ...topic, name: form.name.trim() } : topic);
      await axios.patch(`${API_URL}/${selected._id}`, { topics }, getConfig()); await load(); setModal(null);
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save topic."); }
    finally { setSaving(false); }
  };

  const updateTopics = async (topics) => {
    if (!selected) return;
    try { await axios.patch(`${API_URL}/${selected._id}`, { topics }, getConfig()); await load(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to update topic."); }
  };

  const deleteSubject = async () => {
    if (!selected || !window.confirm(`Delete ${selected.name} and its topics?`)) return;
    try { await axios.delete(`${API_URL}/${selected._id}`, getConfig()); await load(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to delete subject."); }
  };

  return <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
    <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.12] via-white to-sky-500/[0.08] p-5 dark:via-[#0e141a] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">{semester}</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Syllabus tracker</h1><p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">Turn every chapter into a clear next step. Add subjects, edit your plan, and mark progress as you learn.</p></div><div className="flex gap-2"><button type="button" onClick={() => load(true)} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:border-emerald-400 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-300"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> <span className="hidden sm:inline">Refresh</span></button><button type="button" onClick={() => openCreate("subject")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"><Plus size={17} /> Add subject</button></div></div>
    </section>
    {error ? <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div> : null}
    {loading ? <div className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-500 dark:border-white/[0.08] dark:bg-[#10161d]"><RefreshCw className="mr-2 animate-spin" size={18} /> Loading your syllabus...</div> : <>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#10161d]"><p className="text-xs text-slate-500">Overall progress</p><p className="mt-1 text-2xl font-black text-emerald-500">{totals.progress}%</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#10161d]"><p className="text-xs text-slate-500">Topics complete</p><p className="mt-1 text-2xl font-black">{totals.done}<span className="text-sm font-medium text-slate-400">/{totals.total}</span></p></div><div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#10161d]"><p className="text-xs text-slate-500">Active subjects</p><p className="mt-1 text-2xl font-black">{subjects.length}</p></div><div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#10161d] sm:col-span-1"><p className="text-xs text-slate-500">Next focus</p><p className="mt-1 truncate font-bold">{selected?.name || "Add a subject"}</p><div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.08]"><MotionDiv initial={{ width: 0 }} animate={{ width: `${totals.progress}%` }} className="h-full rounded-full bg-emerald-400" /></div></div></section>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Your curriculum</p><h2 className="mt-1 text-xl font-black">Subjects</h2></div><span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-white/[0.08]">{subjects.length} total</span></div><div className="space-y-3">{subjects.length ? subjects.map((subject, index) => { const done = subject.topics.filter((topic) => topic.done).length; const progress = subject.topics.length ? Math.round((done / subject.topics.length) * 100) : 0; return <MotionDiv key={subject._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition dark:bg-[#10161d] sm:p-5 ${selected?._id === subject._id ? "border-emerald-400 shadow-lg shadow-emerald-500/10" : "border-slate-200 hover:border-emerald-400/50 dark:border-white/[0.08]"}`}><button type="button" onClick={() => setSelectedId(subject._id)} className="w-full text-left"><div className="flex items-start gap-3"><span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${subject.color || "bg-emerald-500"}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{subject.name}</h3>{subject.code ? <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/[0.08]">{subject.code}</span> : null}</div><p className="mt-1 text-xs text-slate-500">{done} of {subject.topics.length} topics complete</p></div><span className="text-lg font-black text-emerald-500">{progress}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.08]"><MotionDiv initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} className={`h-full rounded-full ${subject.color || "bg-emerald-500"}`} /></div></button></MotionDiv>; }) : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/[0.12]"><p className="text-sm text-slate-500">Your syllabus is empty.</p><button type="button" onClick={() => openCreate("subject")} className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white">Add your first subject</button></div>}</div></section>
        <section className="h-fit rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#10161d] sm:p-6"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Currently studying</p><h2 className="mt-1 truncate text-2xl font-black">{selected?.name || "Select a subject"}</h2>{selected?.code ? <p className="mt-1 text-xs text-slate-500">{selected.code} · {selectedStats.done}/{selectedStats.total} complete</p> : null}</div>{selected ? <div className="flex gap-1"><button type="button" onClick={openEditSubject} className="rounded-xl p-2 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500" aria-label="Edit subject"><Edit3 size={17} /></button><button type="button" onClick={deleteSubject} className="rounded-xl p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-500" aria-label="Delete subject"><Trash2 size={17} /></button></div> : null}</div>{selected ? <><div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.08]"><MotionDiv initial={{ width: 0 }} animate={{ width: `${selectedProgress}%` }} className={`h-full rounded-full ${selected.color || "bg-emerald-500"}`} /></div><span className="text-sm font-black text-emerald-500">{selectedProgress}%</span></div><div className="mt-6 space-y-2">{selected.topics.length ? selected.topics.map((topic, index) => <div key={topic._id} className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-emerald-400/50 dark:border-white/[0.08]"><button type="button" onClick={() => updateTopics(selected.topics.map((item) => item._id === topic._id ? { ...item, done: !item.done } : item))} aria-label={topic.done ? `Mark ${topic.name} pending` : `Mark ${topic.name} done`} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${topic.done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 dark:bg-white/[0.08]"}`}>{topic.done ? <Check size={14} /> : index + 1}</button><span className={`min-w-0 flex-1 text-sm ${topic.done ? "text-slate-400 line-through" : "font-medium"}`}>{topic.name}</span><span className="hidden text-[10px] font-bold uppercase text-slate-400 sm:block">{topic.done ? "Done" : "Next"}</span><button type="button" onClick={() => openEditTopic(topic)} aria-label={`Edit ${topic.name}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500"><Edit3 size={14} /></button><button type="button" onClick={() => updateTopics(selected.topics.filter((item) => item._id !== topic._id))} aria-label={`Delete ${topic.name}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500"><X size={15} /></button></div>) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/[0.04]">No topics yet. Add the first one.</p>}</div><button type="button" onClick={() => openCreate("topic")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-bold text-slate-500 hover:border-emerald-400 hover:text-emerald-500 dark:border-white/[0.12]"><Plus size={16} /> Add topic</button></> : <p className="mt-8 text-sm text-slate-500">Choose a subject to see its topics.</p>}</section>
      </div>
    </>}
    {modal === "subject" || modal === "edit-subject" ? <Modal title={modal === "subject" ? "Add subject" : "Edit subject"} onClose={() => setModal(null)}><form onSubmit={saveSubject}><Field label="Subject name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Machine Learning" autoFocus /><Field label="Course code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="e.g. CS401" /><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500">Cancel</button><button type="submit" disabled={saving || !form.name.trim()} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : modal === "subject" ? "Add subject" : "Save changes"}</button></div></form></Modal> : null}
    {modal === "topic" || modal === "edit-topic" ? <Modal title={modal === "topic" ? `Add topic to ${selected?.name}` : "Edit topic"} onClose={() => setModal(null)}><form onSubmit={modal === "topic" ? async (event) => { event.preventDefault(); if (!form.name.trim()) return; setSaving(true); try { await updateTopics([...selected.topics, { name: form.name.trim(), done: false }]); setModal(null); setForm({ name: "", code: "" }); } finally { setSaving(false); } } : saveTopic}><Field label="Topic name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Graph traversal" autoFocus /><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500">Cancel</button><button type="submit" disabled={saving || !form.name.trim()} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : modal === "topic" ? "Add topic" : "Save changes"}</button></div></form></Modal> : null}
  </div>;
};

export default Syllabus;
