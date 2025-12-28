import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTags,
  faListCheck,
  faLock,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = featureRefs.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (index !== -1) {
            setVisibleCards((prev) =>
              entry.isIntersecting
                ? prev.includes(index)
                  ? prev
                  : [...prev, index]
                : prev.filter((i) => i !== index)
            );
          }
        });
      },
      { threshold: 0.15 }
    );

    featureRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="snap-section h-full flex items-center p-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-linear-to-r from-[oklch(25%_0.10_245)] to-[oklch(65%_0.18_245)] bg-clip-text text-transparent">
            Task Tracker
          </h1>

          <p className="text-lg md:text-xl font-medium text-foreground/80">
            Your ultimate solution for efficient task management
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Streamline your workflow with intelligent task organization.
            Experience unparalleled efficiency through smart tags, real-time
            status tracking, and intuitive task management.
          </p>

          {!isLoading && (
            <div className="flex gap-4 pt-2">
              <Link
                to={isAuthenticated ? "/tasks" : "/login"}
                className="btn btn--primary px-6 py-3 text-sm"
              >
                {isAuthenticated ? "Go to Tasks" : "Get Started"}
              </Link>

              <a
                href="#features"
                className="btn btn--secondary px-6 py-3 text-sm"
              >
                Learn More
              </a>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="snap-section min-h-full lg:h-full py-12 flex items-center bg-muted full-bleed"
      >
        <div className="content-container flex items-center">
          <div className="max-w-[80%] mx-auto">
            <div className="mb-12">
              <h2 className="bg-linear-to-r from-[oklch(25%_0.10_245)] to-[oklch(65%_0.18_245)] bg-clip-text text-transparent mb-6">
                Choose from our powerful features
              </h2>

              <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                Transform the way you work with powerful features designed for
                maximum efficiency and seamless collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {[
                {
                  icon: faListCheck,
                  title: "Track Tasks Effortlessly",
                  text: "Create, update, and manage your tasks with an intuitive interface.",
                },
                {
                  icon: faTags,
                  title: "Smart Tag System",
                  text: "Organize tasks with custom tags and colors. Filter instantly.",
                },
                {
                  icon: faCheckCircle,
                  title: "Status Management",
                  text: "Track progress with pending, in-progress, and completed states.",
                },
                {
                  icon: faLock,
                  title: "Secure & Private",
                  text: "Your tasks are protected with secure authentication.",
                },
                {
                  icon: faBolt,
                  title: "Lightning Fast",
                  text: "Built with modern web technologies for instant load times.",
                },
                {
                  icon: faCheckCircle,
                  title: "Simple & Intuitive",
                  text: "No learning curve required. Jump right in immediately.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    featureRefs.current[i] = el;
                  }}
                  className={`card--feature transition-all duration-700 ease-out ${
                    visibleCards.includes(i)
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-16 scale-95"
                  }`}
                >
                  <div className="mb-3 text-primary">
                    <FontAwesomeIcon icon={feature.icon} className="text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
