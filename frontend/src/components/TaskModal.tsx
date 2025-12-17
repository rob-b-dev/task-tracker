import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { Task, Tag } from "../types";
import { TAG_COLORS, getTagColors } from "../utils/colorMap";

interface TaskModalProps {
  task: Task | null;
  onSave: (task: Partial<Task> & { tags: Tag[] }) => Promise<void>;
  onClose: () => void;
}

export default function TaskModal({ task, onSave, onClose }: TaskModalProps) {
  const isEditing = !!task?.id;
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [tags, setTags] = useState<Tag[]>(task?.tags || []);
  const [tagName, setTagName] = useState("");
  const [saving, setSaving] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setTags(task.tags || []);
    }
  }, [task]);

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
    tagInputRef.current?.focus();
  };

  const removeTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    tagInputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagName.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagName && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        ...(isEditing && { id: task.id }),
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        tags,
      });
      onClose();
    } catch (error) {
      alert(`Failed to ${isEditing ? "update" : "create"} task`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-card-border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h3 className="text-xl font-semibold mb-6">
          {isEditing ? "Edit Task" : "Create Task"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input resize-none h-24"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input input--select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex gap-2">
              <div className="flex-1 min-h-[42px] px-3.5 py-2 border border-border rounded-xl bg-white transition-all flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                {tags.map((tag) => {
                  const { bg, text } = getTagColors(tag.color);
                  return (
                    <span
                      key={tag.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${bg} ${text}`}
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="ml-0.5 hover:opacity-70 focus:outline-none"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  );
                })}
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={!tags.length ? "Add tags" : ""}
                  className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                disabled={!tagName.trim()}
                className="xl:hidden shrink-0 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 mt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn btn--secondary px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn--primary px-6"
            >
              {saving ? "Saving..." : isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
