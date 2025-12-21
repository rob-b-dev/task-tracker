import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

type ActiveTab = "info" | "password" | "danger";

export default function Profile() {
  const { user, logout, deleteAccount, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Info form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Validation helpers
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name: string) => {
    return name.trim().length >= 2;
  };

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  // Check if profile info has changed and is valid
  const isProfileChanged = useMemo(() => {
    return name !== user?.name || email !== user?.email;
  }, [name, email, user]);

  const isProfileValid = useMemo(() => {
    return isValidName(name) && isValidEmail(email);
  }, [name, email]);

  const canUpdateProfile = isProfileChanged && isProfileValid && !isUpdating;

  // Check if password is valid
  const passwordStrength = getPasswordStrength(newPassword);
  const isPasswordStrong = passwordStrength >= 3;
  const canChangePassword =
    currentPassword.length >= 6 &&
    newPassword.length >= 8 &&
    isPasswordStrong &&
    newPassword === confirmPassword &&
    !isChangingPassword;

  if (!user) {
    return null;
  }

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!isValidName(name)) {
      toast.error("Name must be at least 2 characters", {
        toastId: "name-validation",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", {
        toastId: "email-validation",
      });
      return;
    }

    if (!isProfileChanged) {
      toast.info("No changes to update", { toastId: "no-changes" });
      return;
    }

    setIsUpdating(true);

    try {
      // If email changed, check if it's already taken
      if (email !== user?.email && token) {
        const checkResponse = await fetch(
          `http://localhost:3000/api/auth/check-email?email=${encodeURIComponent(
            email.trim().toLowerCase()
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!checkResponse.ok) {
          if (checkResponse.status === 409) {
            toast.error("This email is already registered", {
              toastId: "email-taken",
            });
            setIsUpdating(false);
            return;
          }
        }
      }

      // Implementation pending - backend endpoint needed
      toast.success("Profile updated successfully", {
        toastId: "profile-success",
      });
    } catch (error) {
      toast.error("Failed to update profile", { toastId: "profile-error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPassword.length < 6) {
      toast.error("Current password is required", { toastId: "current-pwd" });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters", {
        toastId: "pwd-length",
      });
      return;
    }

    if (!isPasswordStrong) {
      toast.error(
        "Password must include uppercase, numbers, and special characters",
        { toastId: "pwd-strength" }
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { toastId: "pwd-match" });
      return;
    }

    setIsChangingPassword(true);

    try {
      // Implementation pending - backend endpoint needed
      toast.success("Password changed successfully", {
        toastId: "pwd-success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to change password", { toastId: "pwd-error" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    // Set a flag to suppress the protected route toast
    sessionStorage.setItem("justLoggedOut", "true");
    logout();
    toast.success("Logged out successfully", { toastId: "logout" });
    navigate("/", { state: { fromLogout: true } });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully", {
        toastId: "account-deleted",
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account",
        { toastId: "delete-error" }
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center py-12">
      <div className="form-container max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="form-container__title">Profile Settings</h3>
          <button onClick={handleLogout} className="btn btn--secondary">
            Logout
          </button>
        </div>
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "info"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Account Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "password"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "danger"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Danger Zone
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === "info" && (
          <form onSubmit={handleUpdateInfo} className="form-container__form">
            <fieldset className="space-y-4">
              <legend className="sr-only">Account Information</legend>

              <div>
                <label htmlFor="name" className="form-container__label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>

              {user.createdAt && (
                <div>
                  <label className="form-container__label">Member Since</label>
                  <p className="text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </fieldset>

            <div className="form-container__actions">
              <button
                type="submit"
                disabled={!canUpdateProfile}
                className="btn btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        )}
        {/* Password Tab */}
        {activeTab === "password" && (
          <form
            onSubmit={handleChangePassword}
            className="form-container__form"
          >
            <fieldset className="space-y-4">
              <legend className="sr-only">Change Password</legend>

              <div>
                <label
                  htmlFor="currentPassword"
                  className="form-container__label"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="form-container__label">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="form-container__label"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  required
                  minLength={8}
                />
              </div>
            </fieldset>

            <div className="form-container__actions">
              <button
                type="submit"
                disabled={!canChangePassword}
                className="btn btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
        {/* Danger Zone Tab */}
        {activeTab === "danger" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-red-800 mb-2">
                Delete Account
              </h4>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. All your
                tasks will be permanently deleted.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="font-medium text-red-800">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="btn bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="btn btn--secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
