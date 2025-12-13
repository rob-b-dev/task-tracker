export const TAG_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

export const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  "#ef4444": { bg: "bg-red-100", text: "text-red-600" },
  "#f97316": { bg: "bg-orange-100", text: "text-orange-600" },
  "#f59e0b": { bg: "bg-amber-100", text: "text-amber-600" },
  "#84cc16": { bg: "bg-lime-100", text: "text-lime-600" },
  "#22c55e": { bg: "bg-green-100", text: "text-green-600" },
  "#10b981": { bg: "bg-emerald-100", text: "text-emerald-600" },
  "#14b8a6": { bg: "bg-teal-100", text: "text-teal-600" },
  "#06b6d4": { bg: "bg-cyan-100", text: "text-cyan-600" },
  "#0ea5e9": { bg: "bg-sky-100", text: "text-sky-600" },
  "#3b82f6": { bg: "bg-blue-100", text: "text-blue-600" },
  "#6366f1": { bg: "bg-indigo-100", text: "text-indigo-600" },
  "#8b5cf6": { bg: "bg-violet-100", text: "text-violet-600" },
  "#a855f7": { bg: "bg-purple-100", text: "text-purple-600" },
  "#d946ef": { bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
  "#ec4899": { bg: "bg-pink-100", text: "text-pink-600" },
};

export const getTagColors = (color: string | null | undefined) =>
  COLOR_MAP[color ?? "#3b82f6"] || { bg: "bg-blue-100", text: "text-blue-600" };
