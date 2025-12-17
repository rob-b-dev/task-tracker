import { useEffect, useState, useMemo } from "react";
import type { Task, Tag } from "../types";
import { getTagColors } from "../utils/colorMap";
import {
  fetchTasks as apiFetchTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
  filterTasks,
} from "../utils/taskHelpers";
import TaskModal from "./TaskModal";
import SearchBar from "./SearchBar";
import "../styles/tasks.css";

function TaskCard({
  task,
  onView,
  onDelete,
}: {
  task: Task;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="task-card min-h-[120px] hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-foreground line-clamp-2 flex-1">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-auto space-y-2">
        <div>
          <span className={`badge badge--${task.status}`}>
            {task.status.replace("-", " ")}
          </span>
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-2 min-h-[24px]">
            {task.tags.slice(0, 3).map((tag) => {
              const { bg, text } = getTagColors(tag.color);
              return (
                <span
                  key={tag.id}
                  className={`inline-block max-w-[120px] px-2.5 py-0.5 rounded-full text-xs truncate ${bg} ${text}`}
                  title={tag.name}
                >
                  {tag.name}
                </span>
              );
            })}
            {task.tags.length > 3 && (
              <span className="inline-flex items-center text-xs text-muted-foreground font-medium whitespace-nowrap">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState<Task | null>(null);

  useEffect(() => {
    apiFetchTasks()
      .then((data) => setTasks(data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (taskData: Partial<Task> & { tags: Tag[] }) => {
    const saved = taskData.id
      ? await updateTask(taskData.id, taskData)
      : await createTask(taskData);
    setTasks((t) =>
      taskData.id
        ? t.map((task) => (task.id === saved.id ? saved : task))
        : [saved, ...t]
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    await apiDeleteTask(id);
    setTasks((t) => t.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery, statusFilter),
    [tasks, searchQuery, statusFilter]
  );

  if (loading) {
    return (
      <div className="page-container justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="page-container justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No tasks yet
            </h3>
            <p className="text-muted-foreground">
              Create your first task to get started
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn--primary px-8 mx-auto"
          >
            Create Your First Task
          </button>
        </div>
        {showModal && (
          <TaskModal
            task={null}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <TaskModal
          task={modalTask}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setModalTask(null);
          }}
        />
      )}

      <div className="page-container">
        <div className="w-full mx-auto max-w-7xl mt-8 px-4">
          <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-lg p-5 mb-6 flex items-center justify-between gap-4">
            <div className="text-center flex-1">
              <h2 className="text-xl font-bold text-foreground mb-1">
                Stay Organized, Get More Done
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your tasks efficiently with priorities and tags
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn--primary shrink-0"
            >
              + New Task
            </button>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            totalTasks={tasks.length}
            filteredCount={filteredTasks.length}
          />

          {!filteredTasks.length ? (
            <div className="text-center py-16 text-muted-foreground">
              No tasks match your filters
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={() => {
                    setModalTask(task);
                    setShowModal(true);
                  }}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
