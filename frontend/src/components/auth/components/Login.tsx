import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("Welcome back!", { toastId: "login-success" });
      navigate("/tasks");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Login failed", {
        toastId: "login-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center py-12">
      <div className="form-container">
        <h3 className="form-container__title">Login to Your Account</h3>
        <form onSubmit={handleSubmit} className="form-container__form">
          <fieldset className="space-y-4">
            <legend className="sr-only">Login Credentials</legend>
            <div>
              <label htmlFor="email" className="form-container__label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="form-container__label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                minLength={6}
              />
            </div>
          </fieldset>

          <div className="form-container__actions">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn--primary w-full"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
