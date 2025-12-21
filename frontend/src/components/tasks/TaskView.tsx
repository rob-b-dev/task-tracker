import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import type { Task, Tag } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { getTagColors } from "../../utils/colorMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  fetchTasks as apiFetchTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
  filterTasks,
} from "../../utils/taskHelpers";
import TaskModal from "./TaskModal";
import SearchBar from "./TaskSearch";

// TaskCardProps defines the props required by the TaskCard component
interface TaskCardProps {
  // Task data to display
  task: Task;
  // Handler to open the task in the modal
  onView: () => void;
  // Handler to delete the task
  onDelete: () => void;
}

// TaskCard is a presentational component that displays a single task
// It receives all data and behavior via props
function TaskCard({ task, onView, onDelete }: TaskCardProps) {
  return (
    <div
      className="task-card relative group min-h-[120px] hover:shadow-lg transition-shadow cursor-pointer"
      // Clicking the card triggers the onView handler passed from the parent
      onClick={onView}
    >
      {/* Delete icon (shown on hover) */}
      <button
        onClick={(e) => {
          // Prevent card click when deleting
          e.stopPropagation();
          onDelete();
        }}
        className="
          absolute top-2 right-2
          opacity-0 group-hover:opacity-100
          p-1 rounded
          text-muted-foreground hover:text-red-600
          transition-opacity
        "
        title="Delete"
      >
        <FontAwesomeIcon icon={faTrash} size="sm" />
      </button>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-foreground line-clamp-2 flex-1">
          {task.title}
        </h3>
      </div>

      {/* Render description only if it exists */}
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-auto space-y-2">
        {/* Task status badge */}
        <div>
          <span className={`badge badge--${task.status}`}>
            {task.status.replace("-", " ")}
          </span>
        </div>

        {/* Render up to 2 tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-2 min-h-6">
            {task.tags.slice(0, 2).map((tag) => {
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
            {/* Indicator for extra tags */}
            {task.tags.length > 2 && (
              <span className="inline-flex items-center text-xs text-muted-foreground font-medium whitespace-nowrap">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ViewTasks is the stateful parent component
// It owns task data, side effects, and business logic
export default function ViewTasks() {
  const { token } = useAuth();

  // Source of truth for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState<Task | null>(null);

  // Fetch tasks on initial render
  useEffect(() => {
    if (!token) return;

    apiFetchTasks(token)
      .then((data) => setTasks(data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Handles both creating and updating tasks
  // Passed down to TaskModal as a prop
  const handleSave = async (taskData: Partial<Task> & { tags: Tag[] }) => {
    if (!token) return;

    // Decide between create or update based on presence of id
    const saved = taskData.id
      ? await updateTask(taskData.id, taskData, token)
      : await createTask(taskData, token);

    // Update local state after persistence
    setTasks((t) =>
      taskData.id
        ? t.map((task) => (task.id === saved.id ? saved : task))
        : [saved, ...t]
    );
  };

  // Deletes a task and updates state
  const handleDelete = async (id: string) => {
    if (!token) return;

    const deletePromise = apiDeleteTask(id, token).then(() => {
      setTasks((t) => t.filter((task) => task.id !== id));
    });

    toast.promise(deletePromise, {
      pending: "Deleting task...",
      success: "Task deleted successfully",
      error: "Failed to delete task",
    });
  };

  // Memoized filtered task list based on search and status
  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery, statusFilter),
    [tasks, searchQuery, statusFilter]
  );

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center px-4 md:px-6 lg:px-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Empty state (no tasks)
  if (!tasks.length) {
    return (
      <div className="h-full flex items-center justify-center py-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-primary text-3xl"
            />
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
      {/* Modal for create/edit */}
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

      <div className="py-12">
        <div className="w-full">
          {/* Header */}
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

          {/* Search and filters */}
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
                  // Open modal in edit mode
                  onView={() => {
                    setModalTask(task);
                    setShowModal(true);
                  }}
                  // Trigger delete handler
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
