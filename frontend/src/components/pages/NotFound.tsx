export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-medium text-foreground">404</h1>
        <div className="h-12 w-px bg-border"></div>
        <p className="text-sm text-foreground">This page could not be found.</p>
      </div>
    </div>
  );
}
