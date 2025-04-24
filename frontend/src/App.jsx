import React from "react";
import Navbar from "./components/Navbar";
import Signup from "./forms/Signup";
import Login from "./forms/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./style.css"; 
import Home from "./pages/Home";
import ListedItems from "./pages/ListedItems";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { userAuthentication } from "./auth/auth";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import RedirectGoogleAuth from "./auth/GoogleRedirectHandler";
import CreateListing from "./pages/CreateListing";
import ListingDetail from "./pages/ListingDetails";
import Profile from "./pages/Profile";
import { UserProfileProvider } from "./components/UserProfileContext";
import EditListing from "./pages/EditListings";


function App() {
  const { isAuthorized } = userAuthentication();

  return (
    
      <Router>
        <UserProfileProvider>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<ListedItems />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={isAuthorized ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={isAuthorized ? <Navigate to="/" /> : <Signup />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/listings/new" element={isAuthorized ? <CreateListing /> : <Login />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/profile" element={isAuthorized ? <Profile /> : <Login />}/>
          <Route path="/edit-listing/:id" element={<EditListing/>} />
        </Routes>
        <Footer />
        </UserProfileProvider>
      </Router>
  );
}

export default App;
