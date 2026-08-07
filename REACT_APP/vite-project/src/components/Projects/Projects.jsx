import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ExternalLink, FolderPlus, LoaderCircle, Pencil, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import { motion } from "framer-motion";
import FolderPreview from "../ui/folder-preview";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";

const MotionArticle = motion.article;
const API_URL = "http://localhost:7000/api/projects";
const SKILLS_URL = "http://localhost:7000/api/skills";
const colors = ["violet", "sky", "emerald", "orange", "pink", "amber"];
const blankProject = { name: "", link: "", description: "", status: "Planning", progress: 0, tags: "" };
const getConfig = () => ({ headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` } });

const Field = ({ label, children }) => <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300"><span>{label}</span>{children}</label>;
const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/[0.1] dark:text-white";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(blankProject);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [collaboratorQuery, setCollaboratorQuery] = useState("");
  const [collaboratorPeople, setCollaboratorPeople] = useState([]);
  const [collaborationMessage, setCollaborationMessage] = useState("");
  const [sendingCollaboration, setSendingCollaboration] = useState(false);

  const loadProjects = async () => {
    try {
      const response = await axios.get(API_URL, getConfig());
      setProjects(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const response = await axios.get(SKILLS_URL, getConfig());
      setSkills(response.data);
    } catch {
      setSkills([]);
    }
  };

  useEffect(() => {
    loadProjects();
    loadSkills();
  }, []);

  useRealtimeUpdates((message) => {
    if (message.type === "projects:changed") loadProjects();
    if (message.type === "skills:changed") loadSkills();
  });

  useEffect(() => {
    if (!editingId || collaboratorQuery.trim().length < 2) {
      setCollaboratorPeople([]);
      return undefined;
    }
    const timer = window.setTimeout(async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/social/people?q=${encodeURIComponent(collaboratorQuery)}`, getConfig());
        setCollaboratorPeople(response.data);
      } catch {
        setCollaboratorPeople([]);
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [collaboratorQuery, editingId]);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankProject);
    setSelectedSkills([]);
    setError("");
    setCollaboratorQuery("");
    setCollaborationMessage("");
    setDrawerOpen(true);
  };

  const openEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      link: project.link || "",
      description: project.description || "",
      status: project.status,
      progress: project.progress,
      tags: (project.tags || []).join(", "),
    });
    setSelectedSkills(project.linkedSkills || []);
    setError("");
    setCollaboratorQuery("");
    setCollaborationMessage("");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (!saving) setDrawerOpen(false);
  };

  const toggleSkill = (name) => {
    setSelectedSkills((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  const requestCollaboration = async (username) => {
    if (!editingId || sendingCollaboration) return;
    setSendingCollaboration(true);
    try {
      await axios.post(`http://localhost:7000/api/social/collaboration/${editingId}`, { username }, getConfig());
      setCollaborationMessage(`Request sent to @${username}. They can approve it from Inbox.`);
      setCollaboratorQuery("");
      setCollaboratorPeople([]);
    } catch (requestError) {
      setCollaborationMessage(requestError.response?.data?.message || "Unable to send collaboration request.");
    } finally {
      setSendingCollaboration(false);
    }
  };

  const syncSkillProjects = async (project, previousName = "") => {
    const relatedSkills = skills.filter((skill) => skill.projectId === project._id || skill.project === previousName || skill.project === project.name);
    const updates = skills.filter((skill) => selectedSkills.includes(skill.name) || relatedSkills.some((item) => item._id === skill._id));
    await Promise.all(updates.map((skill) => {
      const linked = selectedSkills.includes(skill.name);
      return axios.patch(`${SKILLS_URL}/${skill._id}`, linked ? { project: project.name, projectId: project._id } : { project: "", projectId: null }, getConfig());
    }));
  };

  const saveProject = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        link: form.link.trim(),
        progress: Number(form.progress),
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      const response = editingId
        ? await axios.patch(`${API_URL}/${editingId}`, payload, getConfig())
        : await axios.post(API_URL, payload, getConfig());
      await syncSkillProjects(response.data, editingId ? projects.find((project) => project._id === editingId)?.name : "");
      await Promise.all([loadProjects(), loadSkills()]);
      setDrawerOpen(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete ${project.name}? Linked skills will become unassigned.`)) return;
    try {
      await axios.delete(`${API_URL}/${project._id}`, getConfig());
      setProjects((current) => current.filter((item) => item._id !== project._id));
      await loadSkills();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete project.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.12] via-white to-sky-500/[0.08] p-6 dark:via-[#0e141a] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">Build in public</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Project folders</h1><p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">Keep every build visible, connected to your skills, and moving forward.</p></div>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700"><Plus size={18} /> Add project</button>
        </div>
      </section>

      {error && !drawerOpen ? <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div> : null}

      {loading ? <div className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-500 dark:border-white/[0.08] dark:bg-[#10161d]"><LoaderCircle className="mr-2 animate-spin" size={18} /> Loading your projects...</div> : projects.length ? <section>
        <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Your workspace</p><h2 className="mt-1 text-xl font-black">All projects</h2></div><span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-white/[0.08]">{projects.length} {projects.length === 1 ? "folder" : "folders"}</span></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4 xl:grid-cols-5">
          {projects.map((project, index) => <MotionArticle key={project._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group relative flex min-w-0 flex-col items-center rounded-3xl border border-transparent p-3 transition hover:border-slate-200 hover:bg-white dark:hover:border-white/[0.08] dark:hover:bg-white/[0.03]">
            <FolderPreview label={project.name} letter={project.name.charAt(0).toUpperCase()} color={colors[index % colors.length]} size="lg" onClick={() => openEdit(project)} />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400"><span className={`h-1.5 w-1.5 rounded-full ${project.status === "Completed" ? "bg-emerald-400" : "bg-violet-400"}`} />{project.progress}% · {project.status}</div>
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100"><button type="button" onClick={() => openEdit(project)} aria-label={`Edit ${project.name}`} className="rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-slate-200 hover:text-violet-500 dark:bg-[#151c23] dark:ring-white/[0.1]"><Pencil size={14} /></button><button type="button" onClick={() => deleteProject(project)} aria-label={`Delete ${project.name}`} className="rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-slate-200 hover:text-red-500 dark:bg-[#151c23] dark:ring-white/[0.1]"><Trash2 size={14} /></button></div>
          </MotionArticle>)}
        </div>
      </section> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-white/[0.12] dark:bg-[#10161d]"><FolderPlus className="mx-auto text-violet-500" size={34} /><h2 className="mt-4 font-bold">No project folders yet</h2><p className="mt-2 text-sm text-slate-500">Start a project and give your next idea a home.</p><button type="button" onClick={openCreate} className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white">Create your first project</button></div>}

      {drawerOpen ? <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" onClick={closeDrawer}><aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-[#10161d]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-white/[0.08] sm:px-7"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">Project workspace</p><h2 className="mt-1 text-xl font-black">{editingId ? "Edit project" : "New project"}</h2></div><button type="button" onClick={closeDrawer} aria-label="Close project drawer" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"><X size={20} /></button></div>
        <form onSubmit={saveProject} className="flex min-h-0 flex-1 flex-col"><div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
          <Field label="Project name"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Campus Connect" className={inputClass} autoFocus /></Field>
          <Field label="Project link"><div className="relative"><ExternalLink size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="url" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} placeholder="https://github.com/you/project" className={`${inputClass} pl-9`} /></div></Field>
          <Field label="Description"><textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What are you building?" className={`${inputClass} resize-none`} /></Field>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Status"><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={`${inputClass} bg-white dark:bg-[#10161d]`}><option>Planning</option><option>In progress</option><option>Completed</option></select></Field><Field label={`Progress: ${form.progress}%`}><input type="range" min="0" max="100" value={form.progress} onChange={(event) => setForm({ ...form, progress: event.target.value })} className="mt-5 w-full accent-violet-600" /></Field></div>
          <Field label="Tags"><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="React, Node.js" className={inputClass} /><span className="mt-1 block text-xs font-normal text-slate-400">Separate tags with commas.</span></Field>
          <fieldset><legend className="text-sm font-semibold text-slate-600 dark:text-slate-300">Related skills <span className="font-normal text-slate-400">optional</span></legend><div className="mt-2 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2 dark:border-white/[0.1]">{skills.length ? skills.map((skill) => <label key={skill._id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.05]"><input type="checkbox" checked={selectedSkills.includes(skill.name)} onChange={() => toggleSkill(skill.name)} className="h-4 w-4 accent-violet-600" />{skill.name}</label>) : <p className="p-2 text-sm text-slate-500">Add skills first to link them here.</p>}</div></fieldset>
          {editingId ? <section className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4"><div className="flex items-start gap-3"><UserPlus className="mt-0.5 shrink-0 text-violet-500" size={18} /><div className="min-w-0 flex-1"><h3 className="text-sm font-bold">Work together</h3><p className="mt-1 text-xs leading-5 text-slate-500">Invite someone by username. They must approve the request in Inbox before this folder appears in their Projects.</p><div className="relative mt-3"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={collaboratorQuery} onChange={(event) => setCollaboratorQuery(event.target.value.replace(/^@/, ""))} placeholder="Search @username" className={`${inputClass} pl-9`} /></div>{collaboratorPeople.length ? <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/[0.1] dark:bg-[#151c23]">{collaboratorPeople.map((person) => <button key={person._id} type="button" onClick={() => requestCollaboration(person.username)} disabled={sendingCollaboration} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-violet-500/10"><img src={person.avatar || "https://i.pravatar.cc/64?img=12"} alt="" className="h-7 w-7 rounded-full" /><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{person.name}</strong><small className="text-xs text-violet-500">@{person.username}</small></span><span className="text-xs font-semibold text-violet-500">Invite</span></button>)}</div> : null}{collaborationMessage ? <p className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-300">{collaborationMessage}</p> : null}</div></div></section> : null}
          {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
        </div><div className="flex gap-3 border-t border-slate-200 p-5 dark:border-white/[0.08] sm:p-7"><button type="button" onClick={closeDrawer} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 dark:border-white/[0.1] dark:text-slate-300">Cancel</button><button type="submit" disabled={saving} className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? <LoaderCircle className="mx-auto animate-spin" size={18} /> : editingId ? "Save changes" : "Create project"}</button></div></form>
      </aside></div> : null}
    </div>
  );
};

export default Projects;
