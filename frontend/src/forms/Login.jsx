import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MapPinHouse } from "lucide-react";
import { userAuthentication } from "../auth/auth";

function Login() {
  const {login} = userAuthentication()

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
   const [rememberMe, setRememberMe] = useState(false);

  const notify = (message) => toast.success(message);


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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Login Form */}
        <form className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center space-x-2">
                <MapPinHouse className="w-9 h-9 text-indigo-600 flex items-center justify-center" />
                 
                <span className="text-2xl font-bold text-gray-900">LocalConnecto</span>
              </div>
            </div>

            {/* Login Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
              <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                  id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
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
                    placeholder="Enter your Password"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    Remember Password
                  </label>
                </div>
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Login
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-600">No account yet? </span>
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">Register</Link>
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-500 text-sm">Or Login With</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign In */}
            <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 to-indigo-100 items-center justify-center p-16">
          <img src="src/assets/img-bg.jpg" alt="" className="w-full h-full object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
