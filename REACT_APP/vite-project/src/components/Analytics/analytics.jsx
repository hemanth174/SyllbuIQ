import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Activity,
  ArrowUpRight,
  FolderKanban,
  RefreshCw,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";

const MotionBar = motion.div;

const API_URL = "https://syllbuiq-production.up.railway.app/api/analytics";
const getConfig = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("sylluIQTokens")}` },
});

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const loadAnalytics = async (manual = false) => {
    if (manual) setReloading(true);
    setError("");
    try {
      const response = await axios.get(API_URL, getConfig());
      setData(response.data);
      setAnimationKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
      setReloading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  useRealtimeUpdates((message) => {
    if (
      message.type === "skills:changed" ||
      message.type === "projects:changed"
    )
      loadAnalytics();
  });

  const activityMax = Math.max(
    ...(data?.activity || []).map((day) => day.events),
    1,
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-500">
            Your learning signal
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A live view of your skills, projects, and recent momentum.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadAnalytics(true)}
          disabled={loading || reloading}
          aria-label="Reload analytics"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-[#10161d] dark:text-slate-300"
        >
          <RefreshCw size={16} className={reloading ? "animate-spin" : ""} />{" "}
          {reloading ? "Refreshing" : "Reload"}
        </button>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-800 dark:bg-[#10161d]">
          <RefreshCw className="mr-2 animate-spin" size={18} /> Loading
          analytics...
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-slate-200 py-4 text-sm dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white">
              {data.summary.skills} skills
            </span>
            <span className="text-slate-500">
              {data.summary.projects} projects
            </span>
            <span className="text-slate-500">
              {data.summary.averageSkillCompletion}% average skill completion
            </span>
            <span className="text-slate-500">
              {data.summary.linkedSkills} linked skills
            </span>
            <span className="ml-auto font-semibold text-emerald-500">
              {data.summary.averageProjectProgress}% average project progress
            </span>
          </div>
          <div
            key={animationKey}
            className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                    Last 7 days
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    Recent activity
                  </h2>
                </div>
                <Activity className="text-emerald-500" size={21} />
              </div>
              <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4">
                {data.activity.map((day, index) => (
                  <div
                    key={day.key}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="relative flex h-full w-full items-end justify-center">
                      <MotionBar
                        initial={{ height: 0 }}
                        animate={{
                          height: `${(day.events / activityMax) * 100}%`,
                        }}
                        transition={{
                          duration: 0.65,
                          delay: index * 0.06,
                          ease: "easeOut",
                        }}
                        className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-300"
                        title={`${day.events} activity events`}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{day.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-slate-500">
                Activity events are created when you add or update skills and
                projects.
              </p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
              <div className="flex items-center gap-2">
                <Target className="text-violet-500" size={20} />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Skill progress
                </h2>
              </div>
              <div className="mt-6 space-y-5">
                {data.skills.length ? (
                  data.skills.map((skill, index) => (
                    <div key={skill._id}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                          {skill.name}
                        </span>
                        <span className="font-semibold text-violet-500">
                          {skill.completion}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <MotionBar
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.completion}%` }}
                          transition={{ duration: 0.7, delay: index * 0.08 }}
                          className="h-full rounded-full bg-violet-500"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Add skills to see your progress here.
                  </p>
                )}
              </div>
            </section>
          </div>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#10161d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-500">
                  Work in motion
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  Project progress
                </h2>
              </div>
              <FolderKanban className="text-sky-500" size={21} />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {data.projects.length ? (
                data.projects.map((project, index) => (
                  <div
                    key={project._id}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                          {project.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {project.status}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-slate-400"
                      />
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <MotionBar
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.7, delay: index * 0.08 }}
                        className="h-full rounded-full bg-sky-500"
                      />
                    </div>
                    <p className="mt-2 text-right text-xs font-semibold text-sky-500">
                      {project.progress}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Create a project to track progress here.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Analytics;
