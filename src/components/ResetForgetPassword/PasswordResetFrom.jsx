import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BASE_URL;

   const PasswordResetForm = () => {
   const { token } = useParams();
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [message, setMessage] = useState('');
   const navigate = useNavigate();

   // Log token when component mounts
   useEffect(() => {
      if (token) {
         console.log("Reset token from URL:", token);
      } else {
         console.warn("No reset token found in URL");
      }
   }, [token]);

   const handleResetPassword = async (e) => {
      e.preventDefault();
      setError('');
      setMessage('');
      console.log(token);

      try {
         const response = await axios.post(
            `${API_BASE}/api/auth/reset-password`,
            { token, password },
            { headers: { "Content-Type": "application/json" } }
         );
         setMessage(response.data.message);
         console.log(token);
         navigate('/login');
         
      } catch (err) {
         setError(err.response?.data?.message || "Something went wrong");
      }
   };


   return (
      <div className="w-full z-50 md:py-10 px-2 py-2 pt-13 md:pt-18 fixed top-0 left-0 bg-black h-full">
         <div className="flex flex-col place-content-center-safe bg-fixed max-w-7xl mx-auto h-[80vh] bg-[url('https://i.pinimg.com/1200x/4d/17/ce/4d17ce529909f8d0c209c16bb5032774.jpg')] bg-no-repeat bg-fixed bg-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="w-full p-4 mx-auto max-w-md">
                  <form onSubmit={handleResetPassword}>
                     <div className="backdrop-blur-sm grid grid-cols-1 outline-5 outline-dashed outline-white rounded-lg">
                        <div className="w-full py-5 px-3">
                           <h1 className="text-3xl md:text-3xl text-neutral-50 font-bold font-mono text-center">Password Reset</h1>
                        </div>
                        <div className="p-4 relative">
                           <label htmlFor="password" className="text-neutral-50">Enter your new Password</label>
                           <input
                              onChange={(e) => setPassword(e.target.value)}
                              type="password"
                              name="password"
                              id="password"
                              className="relative py-3 px-2 text-neutral-600 text-md bg-neutral-100 w-full outline-indigo-400 rounded-md focus:outline-2 mt-1 focus:outline-dashed focus:outline-offset-1 shadow-[01px_2px_#ddd]"
                              required
                              
                           />
                        </div>
                        <div className="w-full p-4 relative">
                           <label htmlFor="submit" className="text-sm text-neutral-300">By clicking Submit you are agreeing to reset your password</label>
                           <button type="submit" className="hover:ring-1 hover:ring-neutral-200 cursor-pointer px-3 py-3 w-full bg-black rounded-md shadow-md text-white text-lg">Submit Changes</button>
                        </div>
                        {message && <p className="text-green-500 text-center mt-2">{message}</p>}
                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PasswordResetForm;