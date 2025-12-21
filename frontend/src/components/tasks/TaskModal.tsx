import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { toast } from "react-toastify";

// Types
import type { Task, Tag } from "../../types";

// Utils
import { TAG_COLORS, getTagColors } from "../../utils/colorMap";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// TaskModalProps defines the contract between parent and modal
interface TaskModalProps {
  // Task is null when creating, populated when editing
  task: Task | null;
  // Parent-provided save handler (create or update)
  onSave: (task: Partial<Task> & { tags: Tag[] }) => Promise<void>;
  // Parent-provided close handler
  onClose: () => void;
}

// TaskModal is a controlled form component
// It owns form state but delegates persistence to the parent
export default function TaskModal({ task, onSave, onClose }: TaskModalProps) {
  // Determines whether we are editing an existing task
  const isEditing = !!task?.id;

  // Local form state (initialised from task when editing)
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [tags, setTags] = useState<Tag[]>(task?.tags || []);
  const [tagName, setTagName] = useState("");
  const [saving, setSaving] = useState(false);

  // Ref used to manage focus on the tag input field
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when a different task is passed in
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setTags(task.tags || []);
    }
  }, [task]);

  // Adds a new tag to local state
  const addTag = () => {
    if (!tagName.trim()) return;

    // Check for duplicate tag names (case-insensitive)
    const isDuplicate = tags.some(
      (tag) => tag.name.toLowerCase() === tagName.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Tag already exists");
      return;
    }

    setTags([
      ...tags,
      {
        // Temporary id until persisted
        id: `temp-${Date.now()}`,
        name: tagName.trim(),
        color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
        createdAt: new Date().toISOString(),
      },
    ]);

    setTagName("");
    tagInputRef.current?.focus();
  };

  // Removes a tag by id
  const removeTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    tagInputRef.current?.focus();
  };

  // Keyboard interactions for tag input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagName.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagName && tags.length > 0) {
      // Remove last tag when input is empty
      setTags(tags.slice(0, -1));
    }
  };

  // Handles form submission
  // Builds a payload and delegates saving to the parent
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        // Include id only when editing
        ...(isEditing && { id: task.id }),
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        tags,
      });

      // Close modal after successful save
      onClose();
    } catch {
      toast.error(`Failed to ${isEditing ? "update" : "create"} task`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-card-border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Modal title reflects create vs edit mode */}
        <h3 className="text-xl font-semibold mb-6">
          {isEditing ? "Edit Task" : "Create Task"}
        </h3>

        {/* Controlled form */}
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

          {/* Tag input and list */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>

            <div className="flex gap-2">
              <div className="flex-1 min-h-[42px] px-3.5 py-2 border border-border rounded-xl bg-white flex flex-wrap items-center gap-2">
                {/* Render selected tags */}
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
                        className="ml-1 text-xs hover:opacity-70"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </span>
                  );
                })}

                {/* Tag input */}
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

              {/* Mobile add button */}
              <button
                type="button"
                onClick={addTag}
                disabled={!tagName.trim()}
                className="xl:hidden px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action buttons */}
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
