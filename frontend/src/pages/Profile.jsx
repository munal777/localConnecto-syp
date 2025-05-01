import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  MapPin,
  Mail,
  Phone,
  Camera,
  Heart,
  Package,
  LogOut,
  Edit,
  Plus,
  Tag,
} from "lucide-react";
import { UserProfileAPI } from "../api/userProfile";
import { toast } from "react-toastify";
import { useUserProfile } from "../components/UserProfileContext";
import api from "../api/api";
import { userAuthentication } from "../auth/auth";

const Profile = () => {
  const {logout} = userAuthentication();

  const handleLogout = () => logout();

  const {
    profile,
    updateProfile,
    // isLoading: contextLoading,
    // fetchProfile,
  } = useUserProfile();

  const [activeTab, setActiveTab] = useState("listings");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  // const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setUserListings] = useState([]);


  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "full_name") {
      const nameParts = value.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size cannot exceed 2MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG, and GIF file formats are allowed");
        return;
      }

      // setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          previewImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);

      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setIsLoading(true);
      const imageData = new FormData();
      imageData.append("image", file);

      const response = await UserProfileAPI.patchProfile(
        profile.id,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data) {
        // Update only the image in the profile state
        const updatedImage = response.data.image || response.data;

        updateProfile((prev) => ({
          ...prev,
          image: updatedImage,
        }));

        toast.success("Profile image updated successfully");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to update profile image");
    } finally {
      setIsLoading(false);
      setImageFile(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          key !== "id" &&
          key !== "email" &&
          key !== "image" &&
          key !== "previewImage"
        ) {
          updateData.append(key, formData[key]);
        }
      });

      const updatedProfile = await UserProfileAPI.updateProfile(
        profile.id,
        updateData
      );

      const newProfileData = {
        ...profile,
        ...updatedProfile.data,
        image: profile.image,
      };

      updateProfile(newProfileData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // const handlePartialUpdate = async (field, value) => {
  //   try {
  //     const updateData =
  //       field === "image"
  //         ? new FormData() // Use FormData for image
  //         : { [field]: value };

  //     if (field === "image") {
  //       updateData.append("image", value);
  //     }

  //     const updatedData = await UserProfileAPI.patchProfile(
  //       profile.id,
  //       updateData
  //     );

  //     // setProfile((prev) => ({
  //     //   ...prev,
  //     //   [field]:
  //     //     field === "image" && updatedData.data
  //     //       ? updatedData.data.image
  //     //       : value,
  //     // }));
  //     const fieldValue =
  //       field === "image" && updatedData.data ? updatedData.data.image : value;

  //     setProfile({
  //       ...profile,
  //       [field]: fieldValue,
  //     });

  //     toast.success(`${field} updated successfully`);
  //     return updatedData;
  //   } catch (err) {
  //     console.error(`Failed to update ${field}:`, err);
  //     toast.error(`Failed to update ${field}`);
  //   }
  // };

  // Reset form to original profile data
  // const handleCancel = () => {
  //   setFormData({ ...profile });
  //   setIsEditing(false);
  //   setImageFile(null);
  // };

  // const [favorites, setFavorites] = useState(
  //   userData.favorites.map((item) => item.id)
  // );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // const profileImageUrl =
  //   formData.previewImage || profile.image || "/src/assets/profile.jpg";

  useEffect(() => {
    const userFun = async () => {
      const listingsResponse = await api.get("/items/users_items");
      setUserListings(listingsResponse.data);
    };

    userFun();
  }, []);

  

  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) {
      // Cloudinary URL format
      return `https://res.cloudinary.com/dzetcdznm/${listing.images[0].image}`;
    }
    return "https://images.unsplash.com/photo-1592078615290-033ee584dd43?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80"; // Fallback image
  };

  const formatPrice = (listing) => {
    if (listing.listing_type === "free") {
      return "Free";
    }
    return listing.price ? `Rs ${listing.price}` : "Free";
  };

  const { imageURL } = useUserProfile();
  const profileImageUrl =
    formData.previewImage || imageURL || "/src/assets/profile.jpg";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-18 md:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            {/* bg-gradient-to-r from-indigo-200 to-indigo-50 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-16 "></div>
              <div className="p-6 sm:p-8 -mt-16">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                      <img
                        src={profileImageUrl}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-primary transition-colors"
                      aria-label="Change profile picture"
                    >
                      <Camera size={18} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {`${profile.first_name} ${profile.last_name}`}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start mt-2 space-y-1 sm:space-y-0 sm:space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 flex-shrink-0" />
                        <span>{profile.location || "Not Provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-1 flex-shrink-0" />
                        <span>{profile.email}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600">
                      Member since {profile.created_at}
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-0 sm:ml-auto flex space-x-2">
                    <Link to="/login">
                      <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-red-600 hover:bg-red-100 h-9 px-3 text-sm">
                        <LogOut size={16} className="mr-1" />
                        Sign Out
                      </button>
                    </Link>
                  </div>
                </div>

                {profile.bio && (
                  <p className="mt-6 text-gray-600 max-w-3xl">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 py-10">
              <div className="bg-white shadow-lg border-1 border-gray-100 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      My Active Listings
                    </p>
                    <p className="text-2xl font-semibold">{listings.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg border-1 border-gray-100 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <Heart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Saved Items
                    </p>
                    <p className="text-2xl font-semibold">24</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mt-8">
              {[
                {
                  key: "listings",
                  label: "My Listings",
                  icon: <Package size={18} />,
                },
                {
                  key: "favorites",
                  label: "Favorites",
                  icon: <Heart size={18} />,
                },
                {
                  key: "settings",
                  label: "Settings",
                  icon: <Settings size={18} />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? " text-indigo-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {/* My Listings Tab */}
              {activeTab === "listings" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      My Listings
                    </h2>
                    <Link to="/listings/new">
                      <button className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-500 h-9 px-3 text-sm">
                        <Plus size={16} className="mr-1" />
                        Add New Listing
                      </button>
                    </Link>
                  </div>

                  {listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-20">
                      {listings.map((listing) => (
                        <Link
                          key={listing.id}
                          to={`/listings/${listing.id}`}
                          className="group"
                        >
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col">
                            <div className="relative h-56 bg-gray-200">
                              {listing.images && listing.images.length > 0 ? (
                                <img
                                  src={getImageUrl(listing)}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <span className="text-gray-400">
                                    No image available
                                  </span>
                                </div>
                              )}
                              <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                                <Heart className="w-5 h-5" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-white font-semibold">
                                    {formatPrice(listing)}
                                  </span>
                                  <span className="text-white text-sm flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />{" "}
                                    {listing.location}
                                  </span>
                                </div>
                              </div>
                              <div className="absolute top-3 left-3">
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full border border-indigo-100 bg-indigo-50/80 backdrop-blur-sm text-indigo-700">
                                  {listing.category_name}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 flex-grow">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                {listing.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {listing.description}
                              </p>
                            </div>
                            <div className="px-4 pb-4 flex justify-between">
                              <div className="flex items-center">
                                <Tag className="w-4 h-4 text-indigo-600 mr-1" />
                                <span className="text-xs font-medium text-indigo-600">
                                  {listing.listing_type === "free"
                                    ? "Free Item"
                                    : "For Sale"}
                                </span>
                              </div>
                              <div className="text-xs font-medium text-indigo-600 capitalize flex items-center">
                                <span>{listing.posted_date}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Package
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No listings yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Create your first listing to start sharing with your
                        community
                      </p>
                      <Link to="/create-listing">
                        <button className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                          Create a Listing
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Browse listings and click the heart icon to save items
                    you're interested in
                  </p>
                  <Link to="/listings">
                    <button className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Browse Listings
                    </button>
                  </Link>
                </div>
                //   )}
                // </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Account Settings
                  </h2>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Personal Information
                      </h3>

                      {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="full_name"
                              value={`${formData.first_name} ${formData.last_name}`}
                              onChange={handleFormChange}
                              className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              disabled
                              className="block w-full px-4 py-3 border cursor-not-allowed hover:bg-gray-200 border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              type="text"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleFormChange}
                              className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleFormChange}
                              className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bio
                            </label>
                            <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleFormChange}
                              rows={4}
                              className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-gray-100 hover:bg-indigo-500 h-10 px-4 py-2"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none border border-indigo-600 text-indigo-600 hover:bg-indigo-50 h-10 px-4 py-2"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Full Name
                              </h4>
                              <p className="text-gray-900">{`${profile.first_name} ${profile.last_name}`}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Email
                              </h4>
                              <p className="text-gray-900">{profile.email}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Phone
                              </h4>
                              <p className="text-gray-900">
                                {profile.phone_number || "Not provided"}
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Location
                              </h4>
                              <p className="text-gray-900">
                                {profile.location || "Add your location."}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Bio
                            </h4>
                            <p className="text-gray-900">
                              {profile.bio || "Add bio for your profile."}
                            </p>
                          </div>

                          <div>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none  bg-indigo-600 text-white hover:bg-indigo-500 h-10 px-4 py-2"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit Information
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Account Security
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Password
                          </h4>
                          <p className="text-gray-900">••••••••••</p>
                        </div>

                        <div>
                          <button className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none border border-indigo-600 text-indigo-600 hover:bg-indigo-50 h-10 px-4 py-2">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none text-red-600 border border-red-200 hover:bg-red-50 h-10 px-4 py-2">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
