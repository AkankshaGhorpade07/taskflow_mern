
import React, { useEffect, useMemo, useState } from "react";
import "./style.css";

const API = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/tasks`;

function readTheme() {
  try {
    return localStorage.getItem("taskflow-theme") || "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(readTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Remove URL hash without reloading the page.
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  // Light/Dark theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("taskflow-theme", theme);
    } catch {
      // Theme still works for this session.
    }
  }, [theme]);

  // Load tasks from backend
  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Could not load tasks.");
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setError(
        `${err.message} Check that your backend is running on port 5000.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  // Search and filter tasks
  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = (task.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  // Add task with selected priority
  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not add the task.");
      }

      const created = await response.json();
      const newTask = created.task || created;

      if (newTask._id || newTask.id) {
        setTasks((current) => [newTask, ...current]);
      } else {
        await loadTasks();
      }

      setTitle("");
      setPriority("Medium");
      setFilter("All");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Mark task completed or pending
  async function toggleTask(task) {
    const id = task._id || task.id;
    const updated = {
      ...task,
      completed: !task.completed,
    };

    setError("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error("Could not update the task.");
      }

      const result = await response.json();
      const saved = result.task || result;

      setTasks((current) =>
        current.map((item) =>
          (item._id || item.id) === id
            ? { ...item, ...saved, completed: updated.completed }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete task
  async function deleteTask(task) {
    const id = task._id || task.id;

    if (!window.confirm("Delete this task?")) return;

    setError("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete the task.");
      }

      setTasks((current) =>
        current.filter((item) => (item._id || item.id) !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function priorityClass(value) {
    const p = (value || "Medium").toLowerCase();

    return ["high", "medium", "low"].includes(p) ? p : "medium";
  }

  // Scroll without adding #tasks to the URL
  function scrollToTasks() {
    document.getElementById("tasks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Return to top without adding #home to the URL
  function scrollToHome() {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <button
          type="button"
          className="brand"
          onClick={scrollToHome}
          aria-label="TaskFlow home"
        >
          <span className="brand-icon">✓</span>
          <span>
            TaskFlow
            <small>Productivity workspace</small>
          </span>
        </button>

        <div className="nav-right">
          <span className="workspace-label">
            YOUR PERSONAL WORKSPACE
          </span>

          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme((current) =>
                current === "light" ? "dark" : "light"
              )
            }
            aria-label="Toggle color theme"
            title="Switch light/dark mode"
          >
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
        </div>
      </nav>

      <main className="dashboard">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR DAY, YOUR MOMENT
            </span>

            <h1>
              Make today
              <br />
              <span>count.</span>
            </h1>

            <p>
              Small steps every day lead to big achievements.
              Organize your work and celebrate your progress.
            </p>

            <button
              type="button"
              className="hero-link"
              onClick={scrollToTasks}
            >
              Explore my tasks <span>↓</span>
            </button>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-glow" />
            <div className="art-circle circle-one" />
            <div className="art-circle circle-two" />
            <div className="art-check">✓</div>
            <div className="art-note note-one">✦ Stay focused</div>
            <div className="art-note note-two">↗ Keep growing</div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Task statistics">
          <article className="stat-card stat-total">
            <div className="stat-top">
              <span className="stat-label">ALL TASKS</span>
              <span className="stat-icon">▤</span>
            </div>
            <strong>{tasks.length}</strong>
            <p>Your complete task list</p>
            <div className="stat-accent" />
          </article>

          <article className="stat-card stat-pending">
            <div className="stat-top">
              <span className="stat-label">IN PROGRESS</span>
              <span className="stat-icon">◷</span>
            </div>
            <strong>{pending}</strong>
            <p>One step at a time</p>
            <div className="stat-accent" />
          </article>

          <article className="stat-card stat-completed">
            <div className="stat-top">
              <span className="stat-label">COMPLETED</span>
              <span className="stat-icon">✓</span>
            </div>
            <strong>{completed}</strong>
            <p>Look how far you've come!</p>
            <div className="stat-accent" />
          </article>
        </section>

        <section className="progress-panel">
          <div className="progress-heading">
            <div>
              <span className="eyebrow">YOUR ACHIEVEMENTS</span>
              <h2>Daily progress</h2>
            </div>

            <div className="progress-number">{progress}%</div>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Daily task completion"
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-footer">
            <span>
              {tasks.length === 0
                ? "Your next achievement starts with one task."
                : progress === 100
                  ? "Amazing! Every task is complete. You did it! 🎉"
                  : "Keep going. You're making progress! ✨"}
            </span>

            <strong>
              {completed}/{tasks.length} completed
            </strong>
          </div>
        </section>

        <section id="tasks" className="tasks-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STAY ORGANIZED</span>
              <h2>
                My tasks <span className="task-count">{tasks.length}</span>
              </h2>
            </div>

            <span className="sparkle">✦</span>
          </div>

          <form className="add-task-form" onSubmit={addTask}>
            <div className="task-input-wrap">
              <span className="input-plus">＋</span>

              <input
                aria-label="Task title"
                placeholder="What would you like to accomplish?"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={180}
              />
            </div>

            <select
              aria-label="Task priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="High">🔴 High priority</option>
              <option value="Medium">🟡 Medium priority</option>
              <option value="Low">🟢 Low priority</option>
            </select>

            <button
              type="submit"
              className="add-button"
              disabled={saving || !title.trim()}
            >
              {saving ? "Adding..." : "＋ Add task"}
            </button>
          </form>

          {error && (
            <div className="error-message" role="alert">
              {error}
              <button type="button" onClick={loadTasks}>
                Retry
              </button>
            </div>
          )}

          <div className="task-toolbar">
            <label className="search-box">
              <span>⌕</span>

              <input
                aria-label="Search tasks"
                placeholder="Search your tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <div className="filter-tabs" aria-label="Filter tasks">
              {["All", "Pending", "Completed"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={
                    filter === item ? "filter-tab active" : "filter-tab"
                  }
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                >
                  {item}
                  <span>
                    {item === "All"
                      ? tasks.length
                      : item === "Pending"
                        ? pending
                        : completed}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="task-list">
            {loading ? (
              <div className="empty-state">
                <div className="empty-illustration">◌</div>
                <h3>Loading your tasks...</h3>
                <p>Getting your workspace ready.</p>
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  {search ? "⌕" : filter === "Completed" ? "✓" : "✧"}
                </div>

                <h3>
                  {search
                    ? "No matching tasks"
                    : filter === "Completed"
                      ? "Nothing completed yet"
                      : filter === "Pending"
                        ? "You're all caught up!"
                        : "Your next big thing starts here"}
                </h3>

                <p>
                  {search
                    ? "Try another search term."
                    : filter === "Pending"
                      ? "Enjoy the moment, or add a new task above."
                      : "Add a task above and make your day productive."}
                </p>

                {filter !== "All" && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setFilter("All")}
                  >
                    View all tasks
                  </button>
                )}
              </div>
            ) : (
              visibleTasks.map((task) => (
                <article
                  className={`task-row ${
                    task.completed ? "task-done" : ""
                  }`}
                  key={task._id || task.id}
                >
                  <button
                    type="button"
                    className={`complete-button ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task)}
                    aria-label={
                      task.completed
                        ? "Mark task pending"
                        : "Complete task"
                    }
                    title={
                      task.completed
                        ? "Mark as pending"
                        : "Mark as complete"
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-details">
                    <h3>{task.title}</h3>

                    <div className="task-meta">
                      <span
                        className={`priority-badge ${priorityClass(
                          task.priority
                        )}`}
                      >
                        {priorityClass(task.priority) === "high"
                          ? "🔴"
                          : priorityClass(task.priority) === "low"
                            ? "🟢"
                            : "🟡"}{" "}
                        {task.priority || "Medium"}
                      </span>

                      <span className="task-status">
                        {task.completed ? "Completed" : "In progress"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="footer">
          <span>
            Made for your next big achievement <b>✦</b>
          </span>
          <span>TaskFlow · MERN Stack Web Lab Practical</span>
        </footer>
      </main>
    </div>
  );
}
