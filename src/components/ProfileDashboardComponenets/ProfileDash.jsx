import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ProfileDash() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const logOut =() =>{
    
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  
  }


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your profile.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4" />
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="max-w-md mx-auto mt-6 text-center text-red-500">
        {error}
      </p>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center space-x-4">
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {profile.name}
            </h2>
            <p className="text-indigo-200">{profile.email}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Partner Code</p>
              <p className="text-lg font-medium text-gray-800">
                {profile.partnerCode}
              </p>
            </div>
            {/* Add more fields here if needed */}
          </div>

          {/* Edit Profile Button */}
          <button
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={() => console.log("Navigate to edit profile")}
          >
            Edit Profile
          </button>
        </div>
        <button className="absolute top-5 right-4 px-3 py-2 bg-red-500 rounded-md shadow-md " onClick={logOut}>Log out</button>
      </div>
    </div>
  );
}