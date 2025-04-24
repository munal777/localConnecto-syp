import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { userAuthentication } from "../auth/auth";

function Login() {
  const {login} = userAuthentication()

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [sucess, setSucess] = useState("");

  const notify = (message) => toast.success(message);

  const [showPassword, setShowPassword] = useState(false);

  // Add this function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    e.preventDefault();
    try {
      const res = await api.post("/auth/login/", { email, password });

      const { access, refresh } = res.data;

      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      notify("Login Successful");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 3000);

      // navigate("/");
    } catch (err) {
      // Get the error message from the response
      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        // dj_rest_auth can return errors in different formats
        if (err.response.data.detail) {
          // If error is in the 'detail' field
          errorMessage = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          // For non-field errors like incorrect credentials
          errorMessage = err.response.data.non_field_errors[0];
        } else if (typeof err.response.data === "object") {
          // For field-specific errors
          const firstErrorField = Object.keys(err.response.data)[0];
          if (
            firstErrorField &&
            Array.isArray(err.response.data[firstErrorField])
          ) {
            errorMessage = `${firstErrorField}: ${err.response.data[firstErrorField][0]}`;
          }
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };


  useEffect(() => {
    const handleGoogleCallback = async () => {
        // Check if we are on the callback page
        if (window.location.pathname === '/login/callback') {
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
        <div className="rounded-lg border border-gray-200 bg-gray-100 shadow-md flex-col flex h-full items-center justify-center sm:px-4">
          <div className="flex h-full flex-col justify-center gap-4 p-6">
            <div className="left-0 right-0 inline-block border-gray-200 px-2 py-2.5 sm:px-4">
              <form className="flex flex-col gap-4 pb-4">
                <h1 className="mb-4 text-2xl font-bold text-indigo-600">
                  Login
                </h1>
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
                      />
                    </div>
                  </div>
                </div>
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
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                  <p className="mt-2 cursor-pointer text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="border transition-colors focus:ring-2 p-0.5 disabled:cursor-not-allowed border-transparent bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white disabled:bg-gray-300 disabled:text-gray-700 rounded-lg "
                    onClick={handleLogin}
                  >
                    <span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                      Login
                    </span>
                  </button>

                  <div className="m-auto p-3 text-xl font-semibold text-gray-500">
                    or
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="transition-colors focus:ring-2 p-0.5 disabled:cursor-not-allowed bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:bg-gray-300 disabled:text-gray-700 rounded-lg "
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
                      Sign in with Google
                    </span>
                  </button>
                </div>
              </form>

              <div className="min-w-[270px]">
                <div className="mt-4 text-center text-gray-600">
                  New user?{" "}
                  <Link
                    className="text-indigo-600 underline hover:text-indigo-700"
                    to="/signup"
                  >
                    Create account here
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

export default Login;
