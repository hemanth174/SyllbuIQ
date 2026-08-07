import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Check,
  Code2,
  Eye,
  FolderOpen,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";

const API_URL = "https://syllbuiq-production.up.railway.app/api/skills";
const PROJECTS_URL = "https://syllbuiq-production.up.railway.app/api/projects";
const SKILL_CATALOG_URL =
  "https://gist.githubusercontent.com/theikkila/596d1265ae086c6d1c5e/raw/keywords.json";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getToken = () => Cookies.get("sylluIQTokens");

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [catalogQuery, setCatalogQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [completion, setCompletion] = useState(0);
  const [project, setProject] = useState("");
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [relatedSkill, setRelatedSkill] = useState(null);

  const loadSkills = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSkills(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load your skills.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get(PROJECTS_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProjects(response.data);
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useRealtimeUpdates((message) => {
    if (message.type === "skills:changed") loadSkills();
    if (message.type === "projects:changed") loadProjects();
  });

  useEffect(() => {
    if (!drawerOpen || catalog.length > 0) return;
    const loadCatalog = async () => {
      setCatalogLoading(true);
      setError("");
      try {
        const response = await fetch(SKILL_CATALOG_URL);
        if (!response.ok) throw new Error("Skill catalog could not be loaded");
        const names = await response.json();
        setCatalog(
          [
            ...new Set(
              names.filter((name) => typeof name === "string" && name.trim()),
            ),
          ].sort((a, b) => a.localeCompare(b)),
        );
      } catch (catalogError) {
        setError(catalogError.message);
      } finally {
        setCatalogLoading(false);
      }
    };
    loadCatalog();
  }, [drawerOpen, catalog.length]);

  const availableSkills = useMemo(
    () =>
      catalog.filter(
        (name) =>
          name.toUpperCase().startsWith(selectedLetter) &&
          name.toLowerCase().includes(catalogQuery.toLowerCase()),
      ),
    [catalog, catalogQuery, selectedLetter],
  );
  const averageCompletion = skills.length
    ? Math.round(
        skills.reduce((sum, skill) => sum + skill.completion, 0) /
          skills.length,
      )
    : 0;
  const linkedProjects = new Set(
    skills.map((skill) => skill.projectId).filter(Boolean),
  ).size;
  const projectById = new Map(projects.map((item) => [item._id, item]));

  const openDrawer = () => {
    setError("");
    setEditingSkill(null);
    setSelectedSkill("");
    setCompletion(0);
    setProject("");
    setDrawerOpen(true);
  };

  const openEditDrawer = (skill) => {
    setError("");
    setEditingSkill(skill);
    setSelectedSkill(skill.name);
    setSelectedLetter(skill.name.charAt(0).toUpperCase());
    setCompletion(skill.completion);
    setProject(skill.projectId || "");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedSkill("");
    setCatalogQuery("");
    setCompletion(0);
    setProject("");
    setEditingSkill(null);
  };

  const addSkill = async (event) => {
    event.preventDefault();
    if (!selectedSkill) return;
    setSaving(true);
    setError("");
    try {
      const selectedProject = projects.find((item) => item._id === project);
      const payload = {
        name: selectedSkill,
        completion: Number(completion),
        project: selectedProject?.name || "",
        projectId: selectedProject?._id || null,
      };
      const response = editingSkill
        ? await axios.patch(`${API_URL}/${editingSkill._id}`, payload, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
        : await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
      setSkills((current) =>
        editingSkill
          ? current.map((skill) =>
              skill._id === editingSkill._id ? response.data : skill,
            )
          : [response.data, ...current],
      );
      closeDrawer();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save this skill.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-pink-500">Your toolkit</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            Skills
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Track what you know and see what you want to grow next.
          </p>
        </div>
        <button
          type="button"
          onClick={openDrawer}
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-700"
        >
          <Plus size={18} /> Add skill
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-200 py-3 text-sm dark:border-slate-800">
        <span className="font-semibold text-slate-900 dark:text-white">
          {skills.length} skills
        </span>
        <span className="text-slate-500">
          {averageCompletion}% average completion
        </span>
        <span className="text-slate-500">
          {linkedProjects} projects connected
        </span>
        <span className="ml-auto text-xs uppercase tracking-[0.16em] text-pink-500">
          Keep learning
        </span>
      </div>
      {error && !drawerOpen ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-sm text-slate-500 dark:border-slate-800 dark:bg-[#10161d]">
          <LoaderCircle className="mr-2 animate-spin" size={18} /> Loading your
          skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-[#10161d]">
          <Code2 className="mx-auto text-slate-400" size={30} />
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
            No skills added yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Choose from the skill catalog to start building your toolkit.
          </p>
          <button
            type="button"
            onClick={openDrawer}
            className="mt-5 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((skill) => (
            <article
              key={skill._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#10161d]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    {skill.name}
                  </h2>
                  {projectById.has(skill.projectId) ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Linked to {projectById.get(skill.projectId).name}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      Personal skill
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRelatedSkill(skill)}
                    disabled={!projectById.has(skill.projectId)}
                    aria-label={
                      projectById.has(skill.projectId)
                        ? `View projects related to ${skill.name}`
                        : `No project linked to ${skill.name}`
                    }
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-pink-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800"
                  >
                    <FolderOpen size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditDrawer(skill)}
                    aria-label={`Edit ${skill.name}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-pink-500 dark:hover:bg-slate-800"
                  >
                    <Pencil size={17} />
                  </button>
                  <span className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {skill.completion}%
                  </span>
                </div>
              </div>
              <div className="mt-5 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-pink-500"
                  style={{ width: `${skill.completion}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={closeDrawer}>
          <aside
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-[#10161d]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-500">
                  Skill catalog
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                  {editingSkill ? "Edit skill" : "Add a skill"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close add skill drawer"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addSkill} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Choose a letter
                  <div className="mt-3 grid grid-cols-9 gap-1.5 sm:grid-cols-13">
                    {alphabet.map((letter) => (
                      <button
                        type="button"
                        key={letter}
                        onClick={() => {
                          setSelectedLetter(letter);
                          setSelectedSkill("");
                        }}
                        className={`h-8 rounded-lg text-xs font-semibold transition-colors ${selectedLetter === letter ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-pink-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-pink-500/20"}`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </label>
                <label className="mt-6 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Select skill
                  <div className="relative mt-2">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      value={catalogQuery}
                      onChange={(event) => setCatalogQuery(event.target.value)}
                      placeholder={`Search ${selectedLetter} skills`}
                      className="w-full rounded-xl border border-slate-200 bg-transparent py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-500 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </label>
                <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  {catalogLoading ? (
                    <div className="flex items-center justify-center p-8 text-sm text-slate-500">
                      <LoaderCircle className="mr-2 animate-spin" size={16} />{" "}
                      Loading 7,000+ skills...
                    </div>
                  ) : availableSkills.length === 0 ? (
                    <p className="p-6 text-center text-sm text-slate-500">
                      No skills found for {selectedLetter}.
                    </p>
                  ) : (
                    availableSkills.map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => setSelectedSkill(skill)}
                        className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left text-sm last:border-0 dark:border-slate-800 ${selectedSkill === skill ? "bg-pink-500/10 text-pink-600 dark:text-pink-300" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"}`}
                      >
                        {skill}
                        {selectedSkill === skill ? <Check size={16} /> : null}
                      </button>
                    ))
                  )}
                </div>
                <label className="mt-6 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  How much have you completed?{" "}
                  <span className="font-bold text-pink-500">{completion}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={completion}
                    onChange={(event) => setCompletion(event.target.value)}
                    className="mt-4 w-full accent-pink-600"
                  />
                </label>
                <label className="mt-6 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Related project{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                  <select
                    value={project}
                    onChange={(event) => setProject(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-500 dark:border-slate-700 dark:bg-[#10161d] dark:text-white"
                  >
                    <option value="">No related project</option>
                    {projects.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                {error ? (
                  <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
                    {error}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-3 border-t border-slate-200 p-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSkill || saving}
                  className="flex-1 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle className="mx-auto animate-spin" size={18} />
                  ) : editingSkill ? (
                    "Save changes"
                  ) : (
                    "Add skill"
                  )}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
      {relatedSkill ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setRelatedSkill(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#10161d]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-500">
                  Related project
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                  {relatedSkill.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRelatedSkill(null)}
                aria-label="Close related project dialog"
              >
                <X size={19} className="text-slate-500" />
              </button>
            </div>
            <div className="mt-6 rounded-xl border border-pink-500/20 bg-pink-500/10 p-4">
              <FolderOpen className="text-pink-500" size={20} />
              <p className="mt-3 font-semibold text-slate-950 dark:text-white">
                {relatedSkill.project}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                This skill is connected to your project.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRelatedSkill(null)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <Eye size={16} /> Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Skills;
