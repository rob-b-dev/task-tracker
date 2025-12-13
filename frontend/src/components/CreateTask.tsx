import { useState } from "react";
import { toast } from "react-toastify";
import type { Tag } from "../types";
import { TAG_COLORS, getTagColors } from "../utils/colorMap";

export default function CreateTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);

  const addTag = () => {
    if (!tagName.trim()) return;
    setTags([
      ...tags,
      {
        id: `temp-${Date.now()}`,
        name: tagName.trim(),
        color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
        createdAt: new Date().toISOString(),
      },
    ]);
    setTagName("");
  };

  const clearForm = () => {
    setTask({ title: "", description: "", status: "pending" });
    setTags([]);
    setTagName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title.trim(),
          description: task.description || null,
          status: task.status,
          tags: tags.map((tag) => ({
            name: tag.name,
            color: tag.color ?? "#3b82f6",
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      toast.success("Task created successfully!");
      clearForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container justify-center">
      <div className="max-w-4xl w-full form-container rounded-xl shadow-sm p-5 md:p-8 border border-border">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
          Create Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title *"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="input"
          />
          <textarea
            placeholder="Description (optional)"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="input resize-none h-24"
          />
          <select
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
            className="input input--select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex gap-2">
            <input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Add a tag"
              className="input"
            />
            <button type="button" onClick={addTag} className="btn btn--primary">
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-auto">
            {tags.map((tag) => {
              const { bg, text } = getTagColors(tag.color ?? undefined);
              return (
                <span
                  key={tag.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-sm font-medium ${bg} ${text}`}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t.id !== tag.id))}
                    className="ml-1 font-bold text-xs hover:opacity-70"
                  >
                    &#10005;
                  </button>
                </span>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2 justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn btn--primary px-8"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              disabled={loading}
              className="btn btn--secondary px-8"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
