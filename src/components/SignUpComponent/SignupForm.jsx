import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SignUpForm = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
   });

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
            const response = await fetch(`${BASE_URL}/api/auth/signup`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData),
            }
         );

         const data = await response.json();
         console.log("Success:", data);

         if (response.ok) {
            localStorage.setItem("token", data.token); // store backend token
            navigate("/dashboard");
         } else {
            console.error("Signup failed:", data.message);
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };

   return (
      <div className="max-w-4xl mx-auto h-screen flex items-center justify-center bg-neutral-100">
         <div className="w-full md:max-w-md mx-auto flex flex-col justify-center p-5 rounded-md bg-white shadow-lg shadow-indigo-200/50">
            <h1 className="text-center text-lg text-neutral-600 font-semibold">
               Create an account
            </h1>
            <form className="p-6 rounded-md" onSubmit={handleSubmit}>
               <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                     <label
                        htmlFor="name"
                        className="text-sm font-semibold"
                     >
                        Name
                     </label>
                     <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={formData.name}
                        onChange={(e) =>
                           setFormData({ ...formData, name: e.target.value })
                        }
                     />
                  </div>

                  <div className="flex flex-col space-y-1">
                     <label
                        htmlFor="email"
                        className="text-sm font-semibold"
                     >
                        Email
                     </label>
                     <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={formData.email}
                        onChange={(e) =>
                           setFormData({ ...formData, email: e.target.value })
                        }
                     />
                  </div>

                  <div className="flex flex-col space-y-1">
                     <label
                        htmlFor="password"
                        className="text-sm font-semibold"
                     >
                        Password
                     </label>
                     <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={formData.password}
                        onChange={(e) =>
                           setFormData({ ...formData, password: e.target.value })
                        }
                     />
                  </div>

                  <button
                     type="submit"
                     className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
                  >
                     Sign Up
                  </button>

                  <div className="text-sm text-center">
                     Already have an account?{" "}
                     <Link
                        to={"/login"}
                        className="text-indigo-500 hover:underline"
                     >
                        Login
                     </Link>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
};

export default SignUpForm;
