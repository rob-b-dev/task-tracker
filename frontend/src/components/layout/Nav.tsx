import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

export default function Nav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm h-16">
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
                <a
                  href="/#features"
                  className="nav-link"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      document.getElementById("features")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  Features
                </a>
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
            </ul>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="nav-action">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`nav-action__btn ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                  aria-current={
                    location.pathname === "/login" ? "page" : undefined
                  }
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className={`nav-action__btn ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                  aria-current={
                    location.pathname === "/register" ? "page" : undefined
                  }
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="w-6 h-6"
            />
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
            <a
              href="/#features"
              className="nav-link block py-2 px-4 rounded-lg transition-colors hover:bg-background"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (location.pathname === "/") {
                  e.preventDefault();
                  document.getElementById("features")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              Features
            </a>
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
            <div className="nav-action__mobile">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span>Profile</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`nav-action__btn ${
                      location.pathname === "/login" ? "active" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={
                      location.pathname === "/login" ? "page" : undefined
                    }
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`nav-action__btn ${
                      location.pathname === "/register" ? "active" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={
                      location.pathname === "/register" ? "page" : undefined
                    }
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
