import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step: 1 = enter email, 2 = enter OTP + new password
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Message/Error handling (optional)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handler for email submit (send OTP)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler for reset password submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setMessage("Password reset successful. Redirecting to login...");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {step === 1 && (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-center mb-4">Forgot Password</h2>
            <p className="text-center mb-6 text-gray-600">No worries, we'll send you reset instructions.</p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
              >
                Send OTP
              </button>

              {message && <p className="text-green-600 mt-2">{message}</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-center mb-4">Set New Password</h2>
            <p className="text-center mb-6 text-gray-600">An OTP has been sent to your email. Please enter it below.</p>

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  One-Time Password (OTP)
                </label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
              >
                Reset Password
              </button>

              {message && <p className="text-green-600 mt-2">{message}</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>

            <div className="text-center mt-4">
              <button
                className="text-sm text-teal-600 hover:underline"
                onClick={() => setStep(1)}
              >
                Back to email input
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
