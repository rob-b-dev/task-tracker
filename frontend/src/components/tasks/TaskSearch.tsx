interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  totalTasks: number;
  filteredCount: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalTasks,
  filteredCount,
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          className="input flex-1"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input input--select sm:w-40"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalTasks} tasks
      </p>
    </div>
  );
}
