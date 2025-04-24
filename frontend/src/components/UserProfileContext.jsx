
import { createContext, useState, useContext, useEffect } from 'react';
import { UserProfileAPI } from '../api/userProfile';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    image: "",
    bio: "",
    location: "",
    phone_number: "",
    created_at: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageVersion, setImageVersion] = useState(0); 

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await UserProfileAPI.getProfile();
      const profileData = Array.isArray(res.data) ? res.data[0] : res.data;

      // Fix the image URL if needed
      if (profileData.image && profileData.image.startsWith("image/upload/")) {
        profileData.image = profileData.image.replace("image/upload/", "");
      }

      setProfile(profileData);
      return profileData;
    } catch (err) {
      setError("Failed to fetch profile");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [setProfile]);

  const updateProfile = (updatedProfile) => {

    const actualUpdate = 
      typeof updatedProfile === 'function'
        ? updatedProfile(profile)
        : updatedProfile

    if (actualUpdate.image && actualUpdate.image !== profile.image) {
        setImageVersion(prev => prev + 1);
        
      }
    setProfile(prev => ({
      ...prev,
      ...actualUpdate
    }));
  };

  const imageURL = profile.image 
    ? `${profile.image}${profile.image.includes('?') ? '&' : '?'}v=${imageVersion}` 
    : "";

  return (
    <UserProfileContext.Provider 
      value={{ 
        profile, 
        updateProfile, 
        isLoading, 
        error, 
        fetchProfile,
        imageURL
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};