import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, MapPinHouse } from "lucide-react";
import { userAuthentication } from "../auth/auth";

function Signup() {
  const { login } = userAuthentication();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const notify = (message) => toast.success(message);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      toast.dismiss();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!agreeTerms) {
        toast.error("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }
      if (
        !first_name?.trim() ||
        !last_name?.trim() ||
        !email?.trim() ||
        !password?.trim()
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      // Email and Password validation before registartion
      if (!passwordRegex.test(password) || !emailRegex.test(email)) {
        if (!emailRegex.test(email)) {
          toast.error("Please enter a valid email address");
        } else if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
        } else if (!/(?=.*[A-Za-z])/.test(password)) {
          toast.error("Password must contain at least one letter.");
        } else if (!/(?=.*\d)/.test(password)) {
          toast.error("Password must contain at least one digit.");
        }
        return;
      }

      const userData = {
        first_name,
        last_name,
        email,
        password,
      };

      const res = await api.post("/auth/registration/", userData);

      if (res.status === 201) {
        notify("Registration Successful");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === "object") {
          // If there's a non_field_errors array (general validation errors)
          if (err.response.data.non_field_errors) {
            toast.error(err.response.data.non_field_errors[0]);
          }
          // For field-specific errors like your name and email validations
          else {
            const errorMessage = Object.values(err.response.data)[0];
            toast.error(
              Array.isArray(errorMessage) ? errorMessage[0] : errorMessage
            );
          }
        } else {
          // If the error is a simple string
          toast.error(err.response.data);
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      if (!toast.isActive("Registration Successful")) {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Check if we are on the callback page
      if (window.location.pathname === "/login/callback") {
        // Extract the token from URL query params
        const params = new URLSearchParams(window.location.search);
        const googleToken = params.get("access_token");

        if (googleToken) {
          localStorage.setItem(GOOGLE_ACCESS_TOKEN, googleToken);

          // Validate the token through the AuthContext
          await login({ google_token: googleToken });
          navigate("/", { replace: true });
        }
      }
    };

    handleGoogleCallback();
  }, [navigate, login]);


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center space-x-2">
                <MapPinHouse className="w-9 h-9 text-indigo-600 flex items-center justify-center" />
                 
                <span className="text-2xl font-bold text-gray-900">LocalConnecto</span>
              </div>
            </div>

            {/* Sign Up Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join us today! Please fill in your information to get started.</p>
            </div>

            {/* Sign Up Form */}
            <div className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="first_name"
                      type="text"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="last_name"
                      type="text"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your Password"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agree-terms" className="ml-3 text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                 <span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                      {isSubmitting ? "Submitting..." : "Create Account"}
                    </span>
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign In</Link>
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-500 text-sm">Or Sign Up With</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign Up */}
            <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 to-indigo-100 items-center justify-center p-16">
          <img src="src/assets/img-bg.jpg" alt="" className="w-full h-full object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
}


export default Signup;