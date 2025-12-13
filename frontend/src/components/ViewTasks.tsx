import { useState, useEffect } from "react";
import type { Task } from "../types";
import { getTagColors } from "../utils/colorMap";
import "../styles/tasks.css";

const API_URL = "http://localhost:3000/api/tasks";

const EmptyState = ({ message }: { message: string }) => (
  <div className="page-container justify-center py-0">
    <div className="w-full mx-auto">
      <div className="text-center py-16 text-base text-muted-foreground bg-card border border-card-border rounded-xl">
        {message}
      </div>
    </div>
  </div>
);

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setBackendDown(false);
      const response = await fetch(API_URL);

      if (!response.ok) {
        console.error("Server error:", await response.json().catch(() => ({})));
        setTasks([]);
        return;
      }

      const data = await response.json();
      setTasks(data.reverse());
    } catch (err) {
      console.error("Connection error:", err);
      setBackendDown(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <EmptyState message="Loading tasks..." />;
  if (backendDown) {
    return (
      <EmptyState message="Unable to connect to the server. Please make sure the backend is running on port 3000." />
    );
  }

  return (
    <div
      className={`page-container ${tasks.length === 0 ? "justify-center" : ""}`}
    >
      <div className="w-full mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
          Your Tasks
        </h2>
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-base text-muted-foreground bg-card border border-card-border rounded-xl">
            No tasks yet. Use the Create Task link above to add your first task!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-foreground m-0 wrap-break-word max-w-full">
                    {task.title}
                  </h3>
                  <span className={`badge badge--${task.status}`}>
                    {task.status.replace("-", " ")}
                  </span>
                </div>

                {task.description && (
                  <p className="text-muted-foreground my-3 flex-1 wrap-break-word max-w-full whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-3">
                    {task.tags.map((tag) => {
                      const { bg, text } = getTagColors(tag.color ?? undefined);
                      return (
                        <span
                          key={tag.id}
                          className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-medium ${bg} ${text}`}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between items-center mt-auto pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={deletingId === task.id}
                    className="btn btn--delete"
                    aria-label="Delete task"
                  >
                    {deletingId === task.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
