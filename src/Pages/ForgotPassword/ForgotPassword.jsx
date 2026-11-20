import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase/firebaseConfig";
import FloatingLabelInput from "../../Components/FloatingInputs/FloatingLabelInput"; // Assuming your path
import FullScreenLoader from "../../Components/Loaders/FullScreenLoader"; // Assuming your path

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Creates the clean hash path structure required for GitHub Pages
    const resetUrl = `${window.location.origin}${window.location.pathname}#/login`;

    const actionCodeSettings = {
      url: resetUrl,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSuccessMessage("Success! Check your email inbox for the reset link.");
      setEmail(""); // Clear field on success
    } catch (err) {
      setError(err.message || "Could not process password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport-wrapper">
      {loading && <FullScreenLoader />}

      <div className="auth-card-frame">
        <h1>Reset Password</h1>
        
        {/* Descriptive context paragraph to guide the user layout */}
        <p className="auth-context-desc">
          Enter your email address below and we'll send you a link to reset your account credentials.
        </p>

        <form onSubmit={handleResetSubmit} className="auth-form-layout">
          <FloatingLabelInput
            id={"reset-email"}
            label={"Email Address"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="auth-submit-btn">
            Send Reset Link
          </button>

          {/* Conditional layout spaces for success or error notices */}
          {error && <div className="auth-error-banner">{error}</div>}
          {successMessage && <div className="auth-success-banner">{successMessage}</div>}

          <p className="auth-switch-view-text">
            Remember your password? <Link to="/login">Log In Here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

