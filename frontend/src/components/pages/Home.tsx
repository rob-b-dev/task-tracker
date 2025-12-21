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

  // Scroll-triggered animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = featureRefs.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (index !== -1 && entry.isIntersecting) {
            setVisibleCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.15 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none">
      {/* HERO SECTION */}
      <section className="min-h-full snap-section flex items-center p-4 md:p-6 lg:p-8">
        <div className="w-full">
          <div className="max-w-3xl space-y-6 px-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-linear-to-r from-[oklch(25%_0.10_245)] to-[oklch(65%_0.18_245)] bg-clip-text text-transparent">
              Task Tracker
            </h1>
            <p className="text-lg md:text-xl font-medium text-foreground/80">
              The future of work management
            </p>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Streamline your workflow with intelligent task organization.
              Experience unparalleled efficiency through smart tags, real-time
              status tracking, and intuitive task management.
            </p>

            <div className="flex gap-4 pt-2">
              {!isLoading && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="min-h-full snap-section flex items-center"
      >
        <div className="w-full py-12">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-[oklch(25%_0.10_245)] to-[oklch(65%_0.18_245)] bg-clip-text text-transparent mb-6">
              Why Choose Task Tracker?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
              Transform the way you work with powerful features designed for
              maximum efficiency and seamless collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`card--feature transition-all duration-500 ${
                  visibleCards.includes(i)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="mb-3 text-primary">
                  <FontAwesomeIcon icon={feature.icon} className="text-3xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
