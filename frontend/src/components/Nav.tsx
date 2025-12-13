import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Nav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border shadow-sm h-16">
      <div className="main-container h-full flex">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-xl tracking-tight text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Task Tracker
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden xl:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-8">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current={location.pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className={`nav-link ${
                    location.pathname === "/tasks" ? "active" : ""
                  }`}
                  aria-current={
                    location.pathname === "/tasks" ? "page" : undefined
                  }
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className={`nav-link ${
                    location.pathname === "/create" ? "active" : ""
                  }`}
                  aria-current={
                    location.pathname === "/create" ? "page" : undefined
                  }
                >
                  Create Task
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden xl:flex items-center gap-3 ml-auto">
            <button className="px-4 py-2 rounded-lg font-medium text-[0.8125rem] transition-all duration-200 text-foreground border border-border hover:text-primary hover:border-primary/30 hover:-translate-y-px">
              Login
            </button>
            <button className="px-4 py-2 rounded-lg font-medium text-[0.8125rem] transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary-hover hover:-translate-y-px">
              Sign Up
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg z-50">
          <div className="main-container py-4 flex flex-col gap-2">
            <Link
              to="/"
              className={`nav-link block py-2 px-4 rounded-lg transition-colors ${
                location.pathname === "/"
                  ? "active bg-muted"
                  : "hover:bg-background"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/tasks"
              className={`nav-link block py-2 px-4 rounded-lg transition-colors ${
                location.pathname === "/tasks"
                  ? "active bg-muted"
                  : "hover:bg-background"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tasks
            </Link>
            <Link
              to="/create"
              className={`nav-link block py-2 px-4 rounded-lg transition-colors ${
                location.pathname === "/create"
                  ? "active bg-muted"
                  : "hover:bg-background"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Task
            </Link>
            <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-border">
              <button className="px-4 py-2 rounded-lg font-medium text-[0.8125rem] transition-all duration-200 text-foreground border border-border hover:text-primary hover:border-primary/30 hover:-translate-y-px w-full">
                Login
              </button>
              <button className="px-4 py-2 rounded-lg font-medium text-[0.8125rem] transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary-hover hover:-translate-y-px w-full">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
