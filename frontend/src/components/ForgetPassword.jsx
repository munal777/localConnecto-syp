import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, X, KeyRound, Lock } from "lucide-react";
import { data, Link } from "react-router-dom";
import api from "../api/api";

export default function ForgetPassword({ show, onClose }) {
  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //   const [resetSent, setResetSent] = useState(false);

  const resetStates = () => {
    setStep(1);
    setResetEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  const closeModel = () => {
    resetStates();
    onClose();
  };

  const handleSendOtp = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/send-otp/", { email: resetEmail });
    } catch (err) {
      if (err.response) {
        data = err.response.data;

        if (typeof data === "string") {
          toast.error(data); // Rare, but possible
        } else if (typeof data === "object") {
          Object.entries(data).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                if (field === "non_field_errors") {
                  toast.error(msg);
                } else {
                  toast.error(`${field}: ${msg}`); // Field-specific error
                }
              });
            }
          });
        }
      } else {
        // Network or other unknown error
        toast.error("Something went wrong. Please try again.");
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setStep(2); //proceed to OTP input
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP code");
      return;
    }

    if (!/^\d+$/.test(otp)) {
      toast.error("OTP must contain digits only.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be of Six digit Numbers");
      return;
    }

    setIsLoading(true);
    //api call

    setTimeout(() => {
      setIsLoading(false);
      setStep(3); // Proceed to password change
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedNewPassword !== trimmedConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (trimmedNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    } else if (!/(?=.*[A-Za-z])/.test(trimmedNewPassword)) {
      toast.error("Password must contain at least one letter.");
      return;
    } else if (!/(?=.*\d)/.test(trimmedNewPassword)) {
      toast.error("Password must contain at least one digit.");
      return;
    }

    setIsLoading(true);
    //api call

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password has been reset successfully!");
      closeModel();
    }, 1500);
  };

  if (!show) return null;

  return (
    <>
      {/* Forgot Password Modal */}

      <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          {/* Close Button */}
          <button
            onClick={closeModel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
            </h2>

            {step === 1 && (
              <>
                <p className="text-gray-600 text-center text-sm">
                  No worries! Enter your email address and we'll send you an OTP
                  to reset your password.
                </p>

                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!resetEmail || isLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <button
                    onClick={closeModel}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-gray-600 text-center text-sm">
                  Enter the OTP we sent to your email.
                </p>

                {/* otp Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <Link
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="mt-3 text-indigo-600 text-sm underline"
                  >
                    Didn't receive OTP? Go Back
                  </Link>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-gray-600 text-center text-sm">
                  Set your new password.
                </p>

                {/* new password Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* confirm password Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
