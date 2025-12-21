import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0–4
  };

  const strength = getPasswordStrength(password);
  const isStrongEnough = strength >= 3;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isStrongEnough) {
      toast.error("Password is too weak", { toastId: "register-weak-pwd" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { toastId: "register-pwd-match" });
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      toast.success("Account created successfully!", {
        toastId: "register-success",
      });
      navigate("/tasks");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
        { toastId: "register-error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center py-12">
      <div className="form-container w-full">
        <h3 className="form-container__title">Create Your Account</h3>
        <form onSubmit={handleSubmit} className="form-container__form">
          <fieldset className="space-y-4">
            <legend className="sr-only">Account Information</legend>

            <div>
              <label htmlFor="name" className="form-container__label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-container__label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              {/* Password label + strength */}
              <div className="flex mb-2 justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div
                  className={`text-sm transition-opacity ${
                    password ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span
                    className={
                      strength <= 1
                        ? "text-red-500"
                        : strength === 2
                        ? "text-yellow-500"
                        : "text-green-600"
                    }
                  >
                    {
                      ["Very weak", "Weak", "Okay", "Strong", "Very strong"][
                        strength
                      ]
                    }
                  </span>
                </div>
              </div>

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

            <div>
              <label
                htmlFor="confirmPassword"
                className="form-container__label"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
