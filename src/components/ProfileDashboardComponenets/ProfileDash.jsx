import { useEffect, useState } from "react"

const BASE_URL = "http://localhost:5000"; // Replace with your actual base URL

const ProfileDash = () => {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchProfile = async () => {
         setLoading(true);
         setError(null);
         const token = localStorage.getItem('token');
         if (!token) {
            setError("No token found");
            setLoading(false);
            return;
         }
         try {
            const response = await fetch(`${BASE_URL}/api/auth/me`, {
               method: "GET",
               headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
               }
            });
            if (!response.ok) {
               throw new Error("Failed to fetch profile");
            }
            const data = await response.json();
            setProfile(data);
         } catch (err) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      fetchProfile();
   }, []);

   return (
      <div className="max-w-4xl mx-auto bg-linear-to-r from-neutral-100 to-neutral-50">
         {loading && <p>Loading...</p>}
         {error && <p className="text-red-500">{error}</p>}
         {profile && (
            <div>
               <h2>Profile Details</h2>
               <pre>{JSON.stringify(profile, null, 2)}</pre>
            </div>
         )}

         <div className="max-w-md mx-auto flex flex-row gap-3  p-4">
            <div className="size-20 md:size-32 bg-indigo-300 border-r border-neutral-300 rounded-md">

            </div>
            <div className=" space-y-1 flex flex-col gap-3">
               <div className="flex flex-row gap-3 px-2 py-1 rounded-md bg-neutral-200">
                  <p className="text-md text-emerald-500 text-shadow-sm">
                     Name :
                  </p>
                  <p className="text-md text-neutral-600">
                     {/* {profile.user.name} */}
                  </p>
               </div>
               <div className="flex flex-row gap-3 px-2 py-1 rounded-md bg-neutral-200">
                  <p className="text-md text-emerald-500 text-shadow-sm">
                     Email :
                  </p>
                  <p className="text-md text-neutral-600">
                     {/* {profile.user.email} */}
                  </p>
               </div>
               <div className="flex flex-row gap-3 px-2 py-1 rounded-md bg-neutral-200">
                  <p className="text-md text-emerald-500 text-shadow-sm">
                     Partner Code:  
                  </p>
                  <p className="text-md text-neutral-600">
                     {/* {profile.user.partnerCode} */}
                     
                  </p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ProfileDash