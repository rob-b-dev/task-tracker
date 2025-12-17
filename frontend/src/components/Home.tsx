import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-container justify-center gap-12">
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="bg-linear-to-r from-[oklch(25%_0.10_245)] to-[oklch(65%_0.18_245)] bg-clip-text text-transparent font-bold tracking-tight">
          Task Tracker
        </h1>
        <p className="text-md text-muted-foreground">
          Simple, powerful task management with tags and status tracking
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <Link to="/tasks" className="btn btn--primary px-8">
            Get Started
          </Link>
          <a href="#features" className="btn btn--secondary px-8">
            Learn More
          </a>
        </div>
      </header>

      <section
        id="features"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
      >
        <div className="card--feature md:min-h-40 lg:min-h-[180px]">
          <h2 className="text-foreground font-semibold wrap-break-word">
            Track Tasks
          </h2>
          <p className="text-sm text-muted-foreground">
            Easily create tasks and keep track of your progress.
          </p>
        </div>
        <div className="card--feature md:min-h-40 lg:min-h-[180px]">
          <h2 className="text-foreground font-semibold wrap-break-word">
            Tag Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Organize tasks with custom tags and categories.
          </p>
        </div>
        <div className="card--feature md:col-span-2 lg:col-span-1 md:min-h-40 lg:min-h-[180px]">
          <h2 className="text-foreground font-semibold wrap-break-word">
            Status Updates
          </h2>
          <p className="text-sm text-muted-foreground">
            Mark tasks as pending, in-progress, or completed.
          </p>
        </div>
      </section>
    </div>
  );
}
