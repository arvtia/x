import { useState } from "react"
import axios from "axios"

const ResetPassword = () => {
   const [email, setEmail] = useState('');
   const [message, setMessage] = useState('');
   const [error, setError] = useState('');

   const sendLinktoEmail = async (e) => {
      e.preventDefault(); // prevent page reload
      setMessage('');
      setError('');

      try {
         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/restlink`, { email });
         setMessage(response.data.message);
      } catch (err) {
         setError(err.response?.data?.message || "Something went wrong");
      }
   };

   return (
      <>
         <div className="w-full fixed top-0 z-50 bg-gradient-to-tl bg-white h-screen p-5 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
               <div className="flex flex-col space-y-2 p-5 rounded-2xl">
                  <div className="rounded-2xl max-h-screen">
                     <div className="py-11 w-full text-center mt-10">
                        <i className="bi bi-send text-5xl font-bold"></i>
                     </div>

                     <p className="text-3xl font-bold text-shadow-sm text-center pb-3">Reset your Password</p>
                     <p className="text-neutral-400 text-sm md:text-md mb-10 text-center">Enter the email address you used to register with</p>

                     <form className="flex flex-col mx-auto max-w-[370px] p-4 rounded-2xl mb-24" onSubmit={sendLinktoEmail}>
                        <label htmlFor="email" className="text-sm font-semibold py-1">Email</label>
                        <input
                           type="email"
                           id="email"
                           className="text-neutral-500 py-3 px-4 max-w-md rounded-lg outline-neutral-500 bg-neutral-50 ring-1 ring-neutral-300 shadow-sm mb-6 md:mb-10"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                        />

                        <button type="submit" className="px-2 text-white font-mono py-4 rounded-xl text-lg text-shadow-sm bg-neutral-900 border border-t border-e-neutral-50 shadow-xl ring-neutral-400 ring-1">
                           Send Reset Link
                        </button>

                        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
                        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                     </form>
                  </div>
               </div>

               <div className="hidden lg:block p-5">
                  <div className="bg-black rounded-2xl w-full h-full">
                     <img src="https://i.pinimg.com/736x/4d/8d/fa/4d8dfae5617d634bc5cbfef9d6a8d9d2.jpg" alt="side image" className="h-full w-full aspect-square object-cover rounded-2xl" />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ResetPassword;