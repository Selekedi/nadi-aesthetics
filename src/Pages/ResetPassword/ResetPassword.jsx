import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../services/firebase/firebaseConfig";
import FloatingLabelPasswordInput from "../../Components/FloatingInputs/FloatingLabelPasswordInput"; // Assuming your path
import FullScreenLoader from "../../Components/Loaders/FullScreenLoader"; // Assuming your path

export default function ResetPassword() {
  const [oobCode, setOobCode] = useState(null);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    // Look for parameters in the browser's raw URL search block, prior to the router hash
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("oobCode");
    const mode = urlParams.get("mode");

    if (mode === "resetPassword" && code) {
      setOobCode(code);
      setLoading(true);
      
      // Validate that the email action link is sound and fetch user identification info
      verifyPasswordResetCode(auth, code)
        .then((userEmail) => setEmail(userEmail))
        .catch(() => setError("This secure verification link has expired or is invalid."))
        .finally(() => setLoading(false));
    } else {
      setError("Invalid action request. Missing parameter keys.");
    }
  }, [auth]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!oobCode) return;

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // Commit the updated profile credentials to Firebase
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccessMessage("Password changed successfully! Redirecting you to login...");
      
      // Clean up browser address query parameters gracefully and bounce to Login
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to commit credential updates. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport-wrapper">
      {loading && <FullScreenLoader />}

      <div className="auth-card-frame">
        <h1>New Password</h1>

        {/* Display contextual description conditional on email presence */}
        {email && (
          <p className="auth-context-desc">
            Please enter a strong new secure account password for <strong>{email}</strong>.
          </p>
        )}

        {/* Only present the form layout if we are not locked in an invalid link error state */}
        {!error && !successMessage && (
          <form onSubmit={handleUpdateSubmit} className="auth-form-layout">
            <FloatingLabelPasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />

            <button type="submit" className="auth-submit-btn">
              Update Password
            </button>
          </form>
        )}

        {/* Message layout response boxes */}
        {error && (
          <div className="auth-form-layout" style={{ marginTop: "12px" }}>
            <div className="auth-error-banner">{error}</div>
            <p className="auth-switch-view-text">
              Need a new link? <Link to="/forgot-password">Request Reset Here</Link>
            </p>
          </div>
        )}

        {successMessage && (
          <div className="auth-success-banner" style={{ marginTop: "16px" }}>
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

