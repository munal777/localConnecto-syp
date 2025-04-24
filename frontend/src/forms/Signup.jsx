import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { userAuthentication } from "../auth/auth";

function Signup() {
  const { login } = userAuthentication();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const notify = (message) => toast.success(message);

  const [showPassword, setShowPassword] = useState(false);

  // Add this function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      toast.dismiss();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
    <div className="py-20">
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg border border-gray-200 bg-[#f1f1f1] shadow-md flex-col flex h-full items-center justify-center sm:px-4">
          <div className="flex h-full flex-col justify-center gap-4 p-6">
            <div className="left-0 right-0 inline-block border-gray-200 px-2 py-2.5 sm:px-4">
              <form className="flex flex-col gap-4 pb-4">
                <h1 className="mb-4 text-2xl font-bold text-indigo-600">
                  Sign Up
                </h1>

                {/* FirstName Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="first_name"
                    >
                      First Name:
                    </label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 text-sm rounded-lg"
                        id="first_name"
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your FirstName"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* LastName Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="last_name"
                    >
                      Last Name:
                    </label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 text-sm rounded-lg"
                        id="last_name"
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your LastName"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="email"
                    >
                      Email:
                    </label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 text-sm rounded-lg"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="password"
                    >
                      Password:
                    </label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 p-2.5 text-sm rounded-lg"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create your password"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign Up Button */}
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="border transition-colors focus:ring-2 p-0.5 disabled:cursor-not-allowed border-transparent bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white disabled:bg-gray-300 disabled:text-gray-700 rounded-lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                      {isSubmitting ? "Submitting..." : "Sign Up"}
                    </span>
                  </button>

                  <div className="m-auto p-3 text-xl font-semibold text-gray-500">
                    or
                  </div>

                  {/* Sign up with Google */}
                  <button
                    type="button"
                    className="transition-colors focus:ring-2 p-0.5 disabled:cursor-not-allowed bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:bg-gray-300 disabled:text-gray-700 rounded-lg"
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                  >
                    <span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        version="1.1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 48 48"
                        enableBackground="new 0 0 48 48"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                      </svg>
                      Sign up with Google
                    </span>
                  </button>
                </div>
              </form>

              {/* Link to Login Page */}
              <div className="min-w-[270px]">
                <div className="mt-4 text-center text-gray-600">
                  Already have an account?{" "}
                  <Link
                    className="text-indigo-600 underline hover:text-indigo-700"
                    to="/login"
                  >
                    Login here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
